function diffsListToHtmlContentOnly(diffsList){
    let htmlResult = [];


    function createSpanWord(text, className, startTime){
        return `<span class='${className} word' data-start='${startTime}'>${text}</span>`
    }

    function createLine(elements, className){
        return `<span class='${className} line'>${elements}</span>`
    }

    diffsList.forEach(element => {
        const matchType = element.matchType;

        if(matchType === 'equal' ){
            // TODO: do word level - use STT times and text
            let words = element.stt.map((w)=>{
                return createSpanWord(w.text,'equal',w.start)
            })
            htmlResult.push(words.join(' '))
        }
        if(matchType === 'insert' ){
            let words = element.stt.map((w)=>{
                return createSpanWord(w.text,'insert',w.start)
            })
            htmlResult.push(words.join(' '))
        }
        if(matchType === 'delete' ){
            let words = element.baseText.map((w)=>{
                return createSpanWord(w,'delete')
            })
            htmlResult.push(words.join(' '))
        }
        if(matchType === 'replace' ){
            const wordsStt = element.stt.map((w)=>{
                return createSpanWord(w.text,'replaceStt',w.start)
            })
            const wordsBaseText = element.baseText.map((w)=>{
                return createSpanWord(w,'replaceBaseText')
            })

            const wordsSttLine =  createLine(wordsStt.join(' '),'replaceSttLine')
            const baseTextLine =  createLine(wordsBaseText.join(' '),'replaceBaseTextLine')
            const replacedLine = baseTextLine+wordsSttLine ;
            htmlResult.push(replacedLine)
        } 

    
        
    });
    htmlResult = `<div class='text'>${htmlResult.join(' ')}</div>`

    return htmlResult;
}

module.exports.diffsListToHtmlContentOnly = diffsListToHtmlContentOnly;
