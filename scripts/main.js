function generate(path, elementName, depth){
    codesService.getContent(path, (res) => {
        res.forEach(file => {
            if(file.type == "dir"){
                let newClassName = elementName + "-" + file.name;
                showDir(elementName, newClassName, file, depth);
                generate(path + "/" + file.name, newClassName, depth + 1);
            }else{
                showFile(path, elementName, file);
            }
        });
    })
}

function showDir(currentName, newClassName, file, depth){
    let newElem = document.createElement("div");
    newElem.className = newClassName;
    let titleElem = document.createElement("h"+depth);
    titleElem.innerHTML = file.name;
    newElem.appendChild(titleElem);
    $('.'+currentName).append(newElem);
    return newElem;
}

function showFile(path, elementName, file){
    codesService.getContent(path+"/"+file.name, (detailedFile) => {
        let asText = Base64.decode(detailedFile.content);
        let fileContent;
        if(detailedFile.name.match("readme.md")){
            fileContent = getAsDescription(asText);
        }else if(detailedFile.name.match(".*\.cpp")){
            fileContent = getAsSnippet(asText);
        }
        if(fileContent!=null){
            $('.'+elementName).append(fileContent);
        }
    });
}

function getAsSnippet(code){
    let pre = document.createElement('pre');
    let codeElem = document.createElement('code');
    codeElem.className = 'cpp';
    codeElem.innerHTML = convertToCode(code);
    hljs.highlightBlock(codeElem)
    pre.appendChild(codeElem);
    return pre;
}
function convertToCode(code){
    code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    return code;
}
function getAsDescription(text){
    return "<p>"+text+"</p>";
}

function main(){
    codesService = new CodesService();
    $(document).ready(function(){
        generate("", "content",1);
    });
}
hljs.initHighlightingOnLoad();
main();
