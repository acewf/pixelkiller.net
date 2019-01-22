var openedWindow;
function popup(theURL,winName,features) {
alert('popup');
  openedWindow = window.open(theURL,winName,features);
  
}
function popupCenter(theURL,wName,theW,theH) {
  alert('popupCenter');
  openedWindow = window.open(theURL,wName,'width='+theW+',height='+theH+',left='+((screen.availWidth-8)/2-theW/2)+',top='+(screen.availHeight/2-theH/2-14)+',toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no');
}
function popupCenter2(theURL,wName,theW,theH) {
  openedWindow = window.open(theURL,wName,'width='+theW+',height='+theH+',left='+((screen.availWidth-8)/2-theW/2)+',top='+(screen.availHeight/2-theH/2-14)+',toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes');
}
function openfswin(theURL) {
  openedWindow = window.open(theURL,"",'top=0,left=0,width='+(screen.availWidth-9)+',height='+(screen.availHeight-28)+',toolbar=no,location=no,status=no,menubar=no,scrollbars='+((screen.availHeight>610)?'no':'yes')+',resizable=no');
}
function openfswin2(theURL) {
  // for clydesOnline demo popup
  openedWindow = window.open(theURL,"",'top=0,left=0,width='+(screen.availWidth-9)+',height='+(screen.availHeight-28)+',toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no');
}
function popupText(theURL,winName) {
  var win=window.open(theURL,winName,"toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes");
  win.focus();
}
function closePopup() {
  openedWindow.close();
}
function setFlash(bl) {
   blnClose=bl;
  document.flashMovie.SetVariable ("_level0.blnClose",bl);
}
