package main

import (
    "database/sql"
    "log"
    "net/http"
    "text/template"
    "regexp"
    "encoding/json"
    "fmt"
    "time"
    "io/ioutil"
    "os"
    _ "github.com/go-sql-driver/mysql"
)


type DBConf struct {
    user    string `json:"user"`
    password   string `json:"password"`
    host string `json:"host"`
    dbname string `json:"dbname"`
    table string `json:"table"`
}

type RadioPage struct {
    Id    int
    Domain string
    Name  string
    Contact sql.NullString
    RadioUrl sql.NullString
    Widget sql.NullString
}

func getConfig() (configuration map[string]interface{}){
    file, file_err := os.Open("./dbconf.json")
    if file_err != nil {
        fmt.Println("file err:",file_err)
    }
    defer file.Close()
    fileBytes,err := ioutil.ReadAll(file)
    if err != nil {
        fmt.Println("error:", err)
    }
    err = json.Unmarshal([]byte(fileBytes), &configuration)
    if err != nil {
        fmt.Println("error:", err)
    }
    //fmt.Println(configuration)
    return configuration
}

func dbConn() (db *sql.DB) {
    fmt.Println(configuration["user"].(string)+":"+configuration["password"].(string)+"@tcp("+configuration["host"].(string)+")/"+configuration["dbname"].(string))
    db, err := sql.Open("mysql", configuration["user"].(string)+":"+configuration["password"].(string)+"@tcp("+configuration["host"].(string)+")/"+configuration["dbname"].(string))
    if err != nil {
        panic(err.Error())
    }
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(25)
    db.SetConnMaxLifetime(1*time.Minute)
    return db
}

var tmpl = template.Must(template.ParseGlob("templates/*"))
var configuration = getConfig()
var db = dbConn()

func Index(w http.ResponseWriter, r *http.Request) {
    log.Println(r.URL.Path)
    var re = regexp.MustCompile(`(?m)^[\w\.]+`)
    var dom =  re.Find([]byte(r.Host))
    log.Println(dom) 
    selDB, err := db.Query("SELECT id,domain,name,contact,radio_url,widget FROM "+configuration["table"].(string)+" WHERE domain='"+string(dom)+"'")
    if err != nil {
        panic(err.Error())
    }
    page := RadioPage{}
    selDB.Next()
        var id int
        var name, domain string
        var contact,radio_url,widget sql.NullString
        err = selDB.Scan(&id, &domain, &name, &contact, &radio_url, &widget)
        if err != nil {
            panic(err.Error())
        }
        page.Id = id
        page.Name = name
        page.Domain = domain
        page.Contact = contact
        page.RadioUrl = radio_url
        page.Widget = widget
    tmpl.ExecuteTemplate(w, "index", page)
}

func main() {
    log.Println("Server started on: http://localhost:8080")
    fs := http.FileServer(http.Dir("./static"))
  	http.Handle("/static/", http.StripPrefix("/static/", fs))
    http.HandleFunc("/", Index)
    http.ListenAndServe(":8080", nil)
}
