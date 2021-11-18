$(function(){
    const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ja-JP'

    recognition.onresult = (event) => {
        const textInfo = event.results[event.results.length - 1][0]
        const message = textInfo.transcript
        const result = document.getElementById("result");
        result.innerHTML = '';
        const p = document.createElement("p");
        const text =document.createTextNode(message);
        p.setAttribute("class","fw-bold fs-1 text-break");
        p.appendChild(text);
        result.appendChild(p);

        api(message)
    }

    $('.start').on('click', () => {
        recognition.start()
    });

    $('.stop').on('click', () => {
        recognition.stop()
    });

    $('.clear').on('click', () => {
        clearResult()
    });

    $('.opt-csv').on('click', () => {
        handleDownload()
    });

    function api(word) {
        fetch("http://localhost:8080/choice-word?word=" + word,{
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        }).then(response => {
            return response.json();
        }).then((result) => {
            setDom(result);
        });
    }

    function setDom(json) {
        const items = document.getElementById("items");
        const tb = document.getElementById("tb");
        if (json.length > 0) {
            items.style.display='block';
            tb.innerHTML = '';
        } else {
            items.style.display='none';
        }
        json.forEach(
            function (item) {
                const col = document.createElement("tr");
                const row1 = document.createElement("td");
                const row2 = document.createElement("td");
                const row3 = document.createElement("td");
                const row4 = document.createElement("td");
                const text1=document.createTextNode(item.word);
                const text2=document.createTextNode(item.counter);
                const text3=document.createTextNode(item.beforeWord);
                const text4=document.createTextNode(item.afterWord);
                row1.appendChild(text1);
                row2.appendChild(text2);
                row3.appendChild(text3);
                row4.appendChild(text4);
                col.appendChild(row1);
                col.appendChild(row2);
                col.appendChild(row3);
                col.appendChild(row4);

                tb.appendChild(col);
            }
        );
    }

    function clearResult() {
        const tb = document.getElementById("tb");
        tb.innerHTML = '';
        const result = document.getElementById("result");
        result.innerHTML = '';
        const items = document.getElementById("items");
        items.style.display='none';
    }

    function handleDownload() {
        var d = []
        var c = []
        $('table tr').each(function(i, e) {
            var dd = []
            var cc = []
            if(i === 0) {
                $(this).find('th').each(function(j, el) {
                    cc.push($(this).text())
                })
                c.push(cc)
            } else {
                $(this).find('td').each(function(j, el) {
                    dd.push($(this).text())
                })
                d.push(dd)
            }
        })
        var m = $.merge(c, d)
        var bom = new Uint8Array([0xEF, 0xBB, 0xBF])

        // CSV データの用意
        var csv_data = m.map(function(l){return l.join(',')}).join('\r\n')
        var blob = new Blob([bom, csv_data], { type: 'text/csv' })
        var url = (window.URL || window.webkitURL).createObjectURL(blob)
        var a = document.getElementById('downloader')
        a.download = 'data.csv'
        a.href = url

        // ダウンロードリンクをクリックする
        $('#downloader')[0].click()
    }
});