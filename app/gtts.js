const gTTS = require('gtts');
var gtts = new gTTS(`您今天吃了什麼呢？布丁布丁吃什麼今天要來跟您聊的是「鐵達尼號生存者資料集」。

這篇文章介紹了一個改編自Kaggle的鐵達尼號生存者資料集，供機器學習練習使用。資料集分為訓練集和測試集，訓練集包含每位乘客是否存活的結果，而測試集則用於評估模型的表現。資料集中的屬性包括乘客編號、船票等級、名字、性別、年齡、船上的兄弟姐妹、配偶人數、船上的父母、孩子的人數、船票編號、乘客票價、客艙編號和登船港口等。

文章最後提出了一個問題：哪些屬性是影響乘客存活的關鍵因素？我列舉了幾個可能的因素，包括船票等級、性別、年齡和登船港口等，並邀請您在下方分享你們對這些因素的看法。

這篇文章提供了資料集的來源和下載方式，並簡要介紹了資料集的屬性和目標屬性。通過引發讀者對存活與屬性之間關係的思考，本文希望能夠引起您的興趣，鼓勵您進一步探索和討論這個問題。

如果有興趣的話，您可以上網搜尋「布丁布丁吃什麼」，查看文章的全文喔。

那我們下次再來吃點其他東西吧。再見！`, 'zh-tw');
gtts.save('/output/2.mp3', function (err, result) {
  if(err) { throw new Error(err) }
  console.log('Success! Open file /tmp/hello.mp3 to hear result.');
});

// https://tts.yating.tw/#exp