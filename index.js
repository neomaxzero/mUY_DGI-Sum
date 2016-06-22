var parseString = require('xml2js').parseString;
var fs= require('fs');
const PATH= './xml/';


function getDatosCabecera(eComp){

  let cfe=eComp[0]['ns0:Encabezado'][0]['ns0:IdDoc'][0]['ns0:Nro'][0];
  let serie=eComp[0]['ns0:Encabezado'][0]['ns0:IdDoc'][0]['ns0:Serie'][0];
  let total= eComp[0]['ns0:Encabezado'][0]['ns0:Totales'][0]['ns0:MntTotal'][0];
  total = parseInt(total);

  return {
    fenum:cfe,
    feserie:serie,
    total:total
  }
}


let files=fs.readdirSync(PATH);

let c_ok=0;
let c_error=0;
for(var i=0;i<files.length;i++){


  var filePath=PATH+files[i];
  let datosCFE;
  let fin;
  if (i+1==files.length) {
    fin=true;
  }else {
    fin=false;
  }
  console.log('cok:'+c_ok);
  console.log('cerror'+c_error);

  sumXML(filePath,i,c_ok,c_error,fin);
}



function sumXML(filePath,i,c_ok,c_error,fin){
    let Sum=0;


  fs.readFile(filePath, function(err, data) {
    if (err) {
      console.error('File: '+files[i]+ ' - error reading file.');
      return;
    }
      parseString(data, function (err, result) {
      if (err) {
        console.error('File: '+files[i]+ ' - error parsing XML.');
        return;
      }

      //console.dir(result);
      let cfe=result['ns0:CFE'];

      let eComp= cfe['ns0:eTck'] || cfe['ns0:eFact'];
      datosCFE= getDatosCabecera(eComp);

      let eDetalle= eComp[0]['ns0:Detalle'][0]['ns0:Item'];

      for(var item=0;item<eDetalle.length;item++){

        let montoItem =eDetalle[item]['ns0:MontoItem'];
        montoItem =parseInt(montoItem);
        //console.log(Sum);
        Sum+= montoItem;
      }

      let checker;
      if (Sum==datosCFE['total']) {
          checker='OK'
          c_ok++;
      }else {
          checker='Danger Peligro Achtung!!';
          c_error++;
      }

      console.log('File: '+files[i]+ '  '+datosCFE['feserie']+'_'+datosCFE['fenum']+' - Total en Items:'+Sum +' Total en Cabecera: ' +datosCFE['total']+ ' '+checker);
      if (fin) {
        showResults(c_ok,c_error);
      }
    });

  });


}




function showResults(c_ok,c_error){
  console.log('Files Correct: '+ c_ok + ' - Files Error: '+c_error);
}
