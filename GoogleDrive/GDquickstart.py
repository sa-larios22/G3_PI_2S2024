

import os.path
import os
from google.auth.transport.requests import Request #Adaptador de transporte para solicitudes.
from google.oauth2.credentials import Credentials #Proporciona credenciales basadas en tokens de acceso 
from google_auth_oauthlib.flow import InstalledAppFlow #Ejecuta el flujo de autorización OAuth 2.0 y adquiere credenciales de usuario. 
from googleapiclient.discovery import build #Servicio de api de google
from googleapiclient.errors import HttpError #Manejo de errores en las consultas, específicamente si los datos HTTP no eran válidos o eran inesperados

#SCOPES: Alcances, definen los permisos que la aplicación solicitará. 
# En este caso, se solicita acceso de solo lectura a los metadatos de Google Drive.
# Si se modifican estos alcances, se debe eliminar el archivo token.json.
# es decir el scope se crea de solo lectura, si luego quiero subir archivos
# va dar error de permisos, por lo que debo borrar el archivo de token 
# y cambiar el tipo de alcance, para subida/descarga de archivos es drive.file
SCOPES = ["https://www.googleapis.com/auth/drive.metadata.readonly"]

def main():
  """Uso básico de la API de Drive v3.
    Imprime los nombres e IDs de los primeros 10 archivos a los que el usuario tiene acceso.
    Se verifica si el archivo token.json existe. 
    Este archivo almacena los tokens de acceso y actualización del usuario.
    Si el archivo token.json no existe o las credenciales no son válidas, 
    se inicia un flujo de autenticación para obtener nuevas credenciales.
    Las credenciales se guardan en token.json para usos futuros.
  """
  
  creds = None #Variable para almacenar credenciales
  # El archivo token.json almacena los tokens de acceso y actualización del usuario,
  # y se crea automáticamente cuando se completa el flujo de autorización por primera vez.

  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES) #Utiliza tokens de acceso adquiridos mediante la concesión del Código de autorización 
  
  # Si no hay credenciales (válidas) disponibles, permite que el usuario inicie sesión.
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request()) #USO DE LIBRERIA REQUEST -> Actualizar manualmente una instancia de Credenciales
    else:
      #Util para el desarrollo local o para aplicaciones que se instalan en un 
      #sistema operativo de escritorio.
      #from_client_secrets_file: Crea una instancia a partir de un archivo de secretos de cliente de Google.
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentials.json", SCOPES
      )

      #Indica al usuario que abra la URL de autorización en su navegador e intentará 
      #abrir automáticamente la URL por él. Se iniciará un servidor web local para escuchar la respuesta
      #de autorización. Una vez completada la autorización, el servidor de autorización redirigirá el 
      #navegador del usuario al servidor web local. El servidor web obtendrá el código de autorización
      #de la respuesta y se apagará. A continuación, el código se intercambia por un token.
      creds = flow.run_local_server(port=0)

    # Guarda las credenciales para la próxima ejecución
    with open("token.json", "w") as token:
      token.write(creds.to_json())

  try:
    #Crea un Recurso/servicio para interactuar con una API.
    #pero construye el objeto Recurso a partir de un documento de descubrimiento (discovery)
    #que se le da, en lugar de recuperar uno a través de HTTP.
    service = build("drive", "v3", credentials=creds)

    # Llama a la API de Drive v3
    results = (
        #Solicita los primeros 10 (pageSize) archivos a los que el usuario tiene acceso, 
        #obteniendo sus nombres e IDs.
        #Si no se encuentran archivos, se imprime un mensaje indicándolo.
        #Si se encuentran archivos, se imprimen sus nombres e IDs.
        service.files()
        .list(pageSize=10, fields="nextPageToken, files(id, name)")
        .execute()
    )
    items = results.get("files", [])

    if not items:
      print("No files found.")
      return
    print("Files:")
    for item in items:
      print(f"{item['name']} ({item['id']})")
  except HttpError as error:
    # Manejar errores de la API de Drive.
    print(f"An error occurred: {error}")

if __name__ == "__main__":
  main()
  print("DONE...")
  os.system('Pause')