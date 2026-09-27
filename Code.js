var CLIENT_ID = "862732347143-11veh73jh2fpsisal92ldiccc8d79961.apps.googleusercontent.com";
var ALLOWED_EMAILS = ["mardiaxa@gmail.com", "ushamardia789@gmail.com", "anuragmardia@gmail.com"];

function doGet(e) {
  var token = e.parameter.token;
  if (!token) return jsonError("missing token");

  var email = verifyGoogleToken(token);
  if (!email) return jsonError("invalid or expired sign-in");
  if (ALLOWED_EMAILS.indexOf(email) === -1) return jsonError("not authorised: " + email);

  var sheet = SpreadsheetApp.openById("1mkcu3opzTytBQXyF_0haDaws97JsqqnNQEb4oSC0jj0").getSheetByName("Holdings");
  var data = sheet.getDataRange().getValues();
  var fields = ["owner","category","name","isin","folio","nominee","institution","buyDate","qty","buyPrice","invested","currency","price","value","status","notes","maturity","rate","liquidity"];
  var rows = [];
  for (var i = 4; i < data.length; i++) {
    var r = data[i];
    if (!r[0] || String(r[0]).indexOf("TOTALS") === 0 || String(r[0]).indexOf("(INR)") > -1 || String(r[0]).indexOf("(USD)") > -1) continue;
    var row = {};
    for (var j = 0; j < fields.length; j++) row[fields[j]] = r[j] === "" ? null : r[j];
    row.included = (row.status !== "REDEEMED" && row.status !== "SWITCHED OUT");
    if (row.maturity instanceof Date) row.maturity = Utilities.formatDate(row.maturity, "GMT", "yyyy-MM-dd");
    if (row.buyDate instanceof Date) row.buyDate = Utilities.formatDate(row.buyDate, "GMT", "yyyy-MM-dd");
    rows.push(row);
  }
  var out = {prepared: Utilities.formatDate(new Date(),"GMT","yyyy-MM-dd"), rows: rows, viewer: email};
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function verifyGoogleToken(idToken) {
  try {
    var resp = UrlFetchApp.fetch(
      "https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken),
      {muteHttpExceptions: true}
    );
    if (resp.getResponseCode() !== 200) return null;
    var data = JSON.parse(resp.getContentText());
    if (data.aud !== CLIENT_ID) return null;
    if (Number(data.exp) < (Date.now() / 1000)) return null;
    if (data.email_verified !== "true" && data.email_verified !== true) return null;
    return data.email;
  } catch (err) {
    return null;
  }
}

function jsonError(msg) {
  return ContentService.createTextOutput(JSON.stringify({error: msg}))
    .setMimeType(ContentService.MimeType.JSON);
}