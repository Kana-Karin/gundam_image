let file = document.getElementById("file");
let canvas = document.getElementById("canvas");
let canvasWidth = 400;
let canvasHeight = 300;
let uploadImgSrc;
let label = document.querySelector("#label");
let confidence = document.querySelector("#confidence");

// 作成したモデルのURL
const imageModelURL =
  "https://teachablemachine.withgoogle.com/models/kX1iM6VI_/";

// Canvasの準備
canvas.width = canvasWidth;
canvas.height = canvasHeight;
let ctx = canvas.getContext("2d");

console.log("18", ctx);

let classifier = ml5.imageClassifier(imageModelURL + "model.json", () => {
  // ロード完了
  console.log("Model Loaded!");
});

console.log("ml5", classifier);

//画像を読み込む関数
function loadLocalImage(e) {
  // ファイル情報を取得
  let fileData = e.target.files[0];

  // 画像ファイル以外は処理を止める
  if (!fileData.type.match("image.*")) {
    alert("画像を選択してください");
    return;
  }

  // FileReaderオブジェクトを使ってファイル読み込み
  let reader = new FileReader();
  // ファイル読み込みに成功したときの処理
  reader.onload = function () {
    // Canvas上に表示する
    uploadImgSrc = reader.result;
    canvasDraw();
  };
  // ファイル読み込みを実行
  reader.readAsDataURL(fileData);
}

// ファイルが指定された時にloadLocalImage()を実行
file.addEventListener("change", loadLocalImage, false);

// Canvas上に画像を表示する関数
function canvasDraw() {
  // canvas内の要素をクリアする
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Canvas上に画像を表示
  let img = new Image();
  img.src = uploadImgSrc;
  img.onload = function () {
    if (this.width / this.height > canvasWidth / canvasHeight) {
      // 幅に合わせて画像サイズ設定
      var imgWidth = canvasWidth;
      var imgHeight = Math.floor(this.height * (canvasWidth / this.width));
    } else {
      // 高さに合わせて画像サイズ設定
      imgHeight = canvasHeight;
      imgWidth = Math.floor(this.width * (canvasHeight / this.height));
    }

    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
  };
  classifyCanvas();
}

function classifyCanvas() {
  classifier.classify(canvas, gotResult);
}

// 画像認識結果を表示する関数
function gotResult(error, results) {
  console.log(results);
  if (error) {
    console.error(error);
  }
  console.log(results);
  //結果の上位3つを確立で表示
  let resultText =
    "こいつは・・・\n" +
    String(results[0].confidence * 100).substring(0, 2) +
    "%の確率で" +
    results[0].label +
    "\n" +
    String(results[1].confidence * 100).substring(0, 2) +
    "%の確率で" +
    // results[1].label +
    // "\n" +
    // String(results[2].confidence * 100).substring(0, 2) +
    // "%の確率で" +
    results[2].label +
    "\nだな";

  text.textContent = resultText;
}
