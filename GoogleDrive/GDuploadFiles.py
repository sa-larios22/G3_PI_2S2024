
import os
import os.path
from googleapiclient.discovery import build #Servicio de api de google
from googleapiclient.errors import HttpError #Manejo de errores en las consultas, específicamente si los datos HTTP no eran válidos o eran inesperados
from googleapiclient.http import MediaFileUpload #Aplicar el servicio que permite subir archivos
from google.oauth2.credentials import Credentials #Proporciona credenciales basadas en tokens de acceso 
from google.auth.transport.requests import Request #Adaptador de transporte para solicitudes.
from google_auth_oauthlib.flow import InstalledAppFlow #Ejecuta el flujo de autorización OAuth 2.0 y adquiere credenciales de usuario. 


SCOPES = ["https://www.googleapis.com/auth/drive.file"] #Ahora usamos .file porque se va trabajar con archivos

def upload_basic():
    """ CARGA MULTIPARTE:  permite subir metadatos y datos en el mismo para cada solicitud. 
        Usa esta opción si los datos que envías son lo suficientemente pequeños (<5MB)
        como para volver a subirlos en su totalidad, si la conexión falla.

        Esta función inserta un nuevo archivo y retorna ID del archivo subido.
    """

    creds = None #Variable para almacenar credenciales

    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES) 

    # Si no hay credenciales (válidas) disponibles, permite que el usuario inicie sesión.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )

        creds = flow.run_local_server(port=0)

        # Guarda las credenciales para la próxima ejecución
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        # Crea un cliente para interactuar con la API de Google Drive usando las credenciales del usuario.
        service = build("drive", "v3", credentials=creds)

        # Definir metadatos, nombre con el que se va a guardar en Google Drive
        file_metadata = {"name": "example.txt"}
        
        # Se utiliza para definir el archivo y su tipo MIME (Multipurpose Internet Mail Extensions).
        # Otros tipos:
        # Textos
        #       text/plain: Texto sin formato.
        #       text/html: HTML.
        #       text/css: Hojas de estilo en cascada.
        #       text/csv: Valores separados por comas.
        # Imágenes
        #       image/jpeg: Imágenes JPEG.
        #       image/png: Imágenes PNG.
        #       image/gif: Imágenes GIF.
        #       image/svg+xml: Imágenes SVG.
        # Audio
        #       audio/mpeg: Audio MP3.
        #       audio/wav: Audio WAV.
        #       audio/ogg: Audio OGG.
        # Video
        #       video/mp4: Video MP4.
        #       video/mpeg: Video MPEG.
        #       video/ogg: Video OGG.
        # Aplicaciones
        #       application/json: JSON.
        #       application/xml: XML.
        #       application/pdf: PDF.
        #       application/zip: Archivos ZIP.
        #       application/octet-stream: Datos binarios arbitrarios.

        media = MediaFileUpload("archivoEjemplo.txt", mimetype="text/plain")     

        #Subir archivo indicado e imprimir el ID del mismo
        file = (
            service.files()
            .create(body=file_metadata, media_body=media, fields="id")
            .execute()
        )
        print(f'File ID: {file.get("id")}')

    except HttpError as error:
        #Captura de posible error
        print(f"An error occurred: {error}")
        file = None

    return "OK"

if __name__ == "__main__":
    upload_basic()
    print("DONE...")
    os.system('Pause')
