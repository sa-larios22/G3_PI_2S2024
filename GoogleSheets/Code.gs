//FUCIÓN QUE SE EJECUTA CADA VEZ QUE SE INGRESA AL FORMULARIO.
function doGet(){

  // cargar y renderizar la plantilla HTML.
  var template = HtmlService.createTemplateFromFile("Registro");

  template.pubUrl = 'https://script.google.com/macros/s/AKfycbzxuGXjjlSlc8MvzqxIqA0vswr0es2LBOFknc2yAEJamqRsbUzBOkj2q7I7zvYABW-Dkg/exec';
  
  //evaluar el código HTML y devolverá un código en caso de encontrarlo 
  // 1.Remplaza los marcadores de posición (como <?= variable ?>) con los valores reales definidos en el script.
  // 2. Genera HTML: Devuelve un objeto HtmlOutput que contiene el HTML resultante después de evaluar la plantilla.
  // 3. Interfaz de Usuario: Este objeto HtmlOutput se puede usar para mostrar el HTML en un cuadro de diálogo, una 
  //    barra lateral, o como una página web en Google Apps.
  var output =  template.evaluate();

  return output;
}


/*cargar el contenido de un archivo HTML especificado y devolverlo como una cadena. Esto permite que el contenido del archivo HTML se inserte en otro archivo HTML o plantilla. */
function include(fileName){
    
    return HtmlService.createHtmlOutputFromFile(fileName).getContent();

}

/*Recepción de Datos: doPost recibe un objeto e que contiene los parámetros enviados en la solicitud POST. Estos parámetros están disponibles a través de e.parameter, donde e.parameter es un objeto que representa los datos del formulario o cualquier otra información enviada en la solicitud POST. */

function doPost(e){
  //Acceso a la Hoja de Cálculo:
  var SS = SpreadsheetApp.getActiveSpreadsheet();
  // Obtiene una hoja específica por nombre
  var sheetRegistro = SS.getSheetByName('Registro');

  Logger.log(sheetRegistro)

  //Extracción de Parámetros de la Solicitud:
  var id = new Date();
  var email = e.parameter.email;
  var gradoAcademico = e.parameter.gradoAcademico;
  var fechaNacimiento = e.parameter.fechaNacimiento;
  var pais = e.parameter.paisM
  var password = e.parameter.password;
  var acuerdoPrivacidad = (e.parameter.acuerdoPrivacidad == 'on' ) ? 'Aceptado': 'Rechazado';
  var nombreCompleto = e.parameter.nombreCompleto;

  //Inserción en la Hoja de Cálculo:
  sheetRegistro.appendRow([id, nombreCompleto, email, password, fechaNacimiento, pais, gradoAcademico, acuerdoPrivacidad]);

  //Devolución de una Página HTML:
  return HtmlService.createTemplateFromFile('RegistroTerminado').evaluate();

}