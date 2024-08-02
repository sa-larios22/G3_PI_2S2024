

import io # Se usa para manejar flujos de datos en memoria
from PIL import Image
import os
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseDownload #Aplicar el servicio que permite descargar archivos
from google.oauth2.credentials import Credentials #Proporciona credenciales basadas en tokens de acceso 
from google.auth.transport.requests import Request #Adaptador de transporte para solicitudes.
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/drive.file"]

def download_file(real_file_id):
    """ Descarga un archivo.
        Argumentos:
        real_file_id: ID del archivo a descargar.
        Returna: Objeto IO con la ubicación del archivo."""

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
        service = build("drive", "v3", credentials=creds)
        file_id = real_file_id

        request = service.files().get_media(fileId=file_id) # Crea solicitud para obtener contenido del archivo especificado.
        file = io.BytesIO() #Crea un objeto de flujo de bytes en memoria para almacenar el archivo descargado.
        
        #Configura el descargador para almacenar los datos del archivo en el objeto file
        downloader = MediaIoBaseDownload(file, request) 
       
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            print(f"Download {int(status.progress() * 100)}.")

            # Descarga el archivo en fragmentos, mostrando el progreso de la descarga en porcentaje.

    except HttpError as error:
        #Manejo de errores
        print(f"An error occurred: {error}")
        file = None

    return file

if __name__ == "__main__":

    #Es necesario conocer el ID del archivo
    file = download_file(real_file_id="1OpXiHShVB8h0LICBw6o6z-hYvOSEDutu")
    print("DONE...")

    if file:
        file.seek(0)  # Puntero de archivo al principio

        # Para archivos de texto
        # print(file.read().decode('utf-8'))

        # Para imágenes
        image = Image.open(file)
        image.show()

    os.system('Pause')
  