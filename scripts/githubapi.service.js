function CodesService(){
    const API_URL = "http://api.github.com/repos/arkadiuss/algo_snippets/contents/"
    this.getContent = (path, callback) => {
        $.get(API_URL + path, (data, status) => {
            callback(data)
        })
    }
}
