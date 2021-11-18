// 変数
var audioContext
var recorder

// 初期化
window.onload = function init() {
    // オーディオコンテキストの初期化
    audioContext = new (window.AudioContext || window.webkitAudioContext)()

    // 音声入力の取得
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
            // レコーダーの生成
            var input = audioContext.createMediaStreamSource(stream)
            audioContext.resume()
            recorder = new Recorder(input)
        })
    }
}

// 録音開始
function startRecording(button) {
    loadRecord()
    recorder && recorder.record()
}

// 録音停止
function stopRecording(button) {
    endRecord()
    recorder && recorder.stop()

    // 音声認識
    audioRecognize()

    // レコーダーのクリア
    recorder.clear()
}

// Dom情報のクリア
function clearDom(button) {
    clearResult()
}

// Dom情報のクリア
function outputCsv(button) {
    handleDownload()
}

// 音声認識
function audioRecognize() {
    loadSpinner()
    // WAVのエクスポート
    recorder && recorder.exportWAV(function(blob) {
        let reader = new FileReader()
        reader.onload = function() {
            // 音声認識
            let result = new Uint8Array(reader.result)
            let data = {
                "config": {
                    "encoding": "LINEAR16",
                    "languageCode": "ja-JP",
                    "audio_channel_count": 2
                },
                "audio": {
                    "content": arrayBufferToBase64(result)
                }
            }
            fetch('https://speech.googleapis.com/v1/speech:recognize?key=' + apiKey, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(data)
            }).then(function (response) {
                return response.text()
            }).then(function (word) {
                let result_json = JSON.parse(word)
                // 音声認識結果の表示
                word = result_json.results[0].alternatives[0].transcript

                const result = document.getElementById("result");
                result.innerHTML = '';
                const p = document.createElement("p");
                const text =document.createTextNode(word);
                p.setAttribute("class","fw-bold fs-1 text-break");
                p.appendChild(text);
                result.appendChild(p);
                api(word);
                endSpinner();
            })
        }
        reader.readAsArrayBuffer(blob)
    })
}

// ArrayBuffer → Base64
function arrayBufferToBase64(buffer) {
    let binary = ''
    let bytes = new Float32Array(buffer)
    let len = bytes.byteLength
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
}

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

function loadSpinner() {
    const items = document.getElementById("overlay");
    items.style.display='block';
}

function endSpinner() {
    const items = document.getElementById("overlay");
    items.style.display='none';
}

function loadRecord() {
    const items = document.getElementById("record-message");
    items.style.display='block';
}

function endRecord() {
    const items = document.getElementById("record-message");
    items.style.display='none';
}