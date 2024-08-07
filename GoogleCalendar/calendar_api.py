import os.path
import datetime as dt
import csv
import random

# Requisitos
# Python 3.10.7 o mayor
# pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Variables globales
SCOPES = ["https://www.googleapis.com/auth/calendar"]
emails =[]

class GoogleCalendarManager:
    def __init__(self):
        self.service = self._authenticate()

    def _authenticate(self):
        creds = None
        absolute_token_path = os.path.join(os.path.dirname(__file__), "token.json")

        if os.path.exists(absolute_token_path):
            creds = Credentials.from_authorized_user_file(absolute_token_path, SCOPES)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                # Solicitar permisos al usuario client_secret.json
                flow = InstalledAppFlow.from_client_secrets_file(
                    os.path.join(os.path.dirname(__file__), "client_secret.json"), SCOPES)
                creds = flow.run_local_server(port=0)

            # Guarda las credenciales para la próxima vez
            with open(absolute_token_path, "w") as token:
                token.write(creds.to_json())

        return build("calendar", "v3", credentials=creds)

    def listar_eventos(self, max_results=50):
        now = dt.datetime.now(dt.timezone.utc).isoformat()
        tomorrow = (dt.datetime.now(dt.timezone.utc) + dt.timedelta(days=15)).replace(hour=23,
                                                                                  minute=59, second=0, microsecond=0).isoformat()
        
        events_result = self.service.events().list(
            calendarId='primary', timeMin=now, timeMax=tomorrow,
            maxResults=max_results, singleEvents=True,
            orderBy='startTime'
        ).execute()
        events = events_result.get('items', [])

        if not events:
            print('\n!NO SE ENCONTRARON EVENTOS!\n')
        else:
            for event in events:
                start = event['start'].get(
                    'dateTime', event['start'].get('date'))
                print(start, event['summary'],' ID : ',event['id'])

        return events

    def create_event(self, summary, start_time, end_time, timezone, attendees=None):
        event = {
            'summary': summary,
            'start': {
                'dateTime': start_time,
                'timeZone': timezone,
            },
            'end': {
                'dateTime': end_time,
                'timeZone': timezone,
            },

            # random color
            'colorId': random.randint(1, 11),

            # attendees random , escoger varios del arreglo de emails
            'attendees': [{'email': random.choice(emails)} for _ in range(random.randint(1, 10))]
        }

        if attendees:
            event["attendees"] = [{"email": email} for email in attendees]

        try:
            event = self.service.events().insert(calendarId="primary", body=event).execute()
            print(f"Event created: {event.get('htmlLink')}")
        except HttpError as error:
            print(f"An error has occurred: {error}")

    def update_event(self, event_id, summary=None, start_time=None, end_time=None):
        event = self.service.events().get(
            calendarId='primary', eventId=event_id).execute()

        if summary:
            event['summary'] = summary

        if start_time:
            event['start']['dateTime'] = start_time

        if end_time:
            event['end']['dateTime'] = end_time

        updated_event = self.service.events().update(
            calendarId='primary', eventId=event_id, body=event).execute()
        return updated_event

    def delete_event(self, event_id):
        self.service.events().delete(
            calendarId='primary', eventId=event_id).execute()
        return True

    def create_events_from_csv(self, csv_filename, timezone='America/Guatemala'):
        # Define the date range and time slots
        start_date = dt.date(2024, 8, 9)
        end_date = dt.date(2024, 8, 16)
        time_slots = [
            (dt.time(hour=8, minute=0), dt.time(hour=10, minute=0)),
            (dt.time(hour=9, minute=0), dt.time(hour=11, minute=0)),
            (dt.time(hour=10, minute=0), dt.time(hour=12, minute=0)),
            (dt.time(hour=11, minute=0), dt.time(hour=13, minute=0)),
            (dt.time(hour=13, minute=0), dt.time(hour=15, minute=0)),
            (dt.time(hour=14, minute=0), dt.time(hour=16, minute=0)),
            (dt.time(hour=15, minute=0), dt.time(hour=17, minute=0)),
            (dt.time(hour=16, minute=0), dt.time(hour=18, minute=0)),
        ]

        with open(csv_filename, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                codigo = row["Código"]
                nombre = row["Nombre"]
                seccion = row["Sección"]

                # Select a random date and time slot
                event_date = start_date + dt.timedelta(days=random.randint(0, (end_date - start_date).days))
                start_time, end_time = random.choice(time_slots)

                start_datetime = dt.datetime.combine(event_date, start_time).isoformat()
                end_datetime = dt.datetime.combine(event_date, end_time).isoformat()

                summary = f"{nombre} ({seccion}) - {codigo}"

                # Create event in Google Calendar
                self.create_event(summary, start_datetime, end_datetime, timezone)

    def clear_all_events(self):
        events = self.listar_eventos()
        for event in events:
            self.delete_event(event['id'])


if __name__ == "__main__":
    # Instanciar la clase GoogleCalendarManager
    calendar = GoogleCalendarManager()

    absolute_emails_path = os.path.join(os.path.dirname(__file__), "emails.txt")

    # cargar emails desde un archivo txt
    with open(absolute_emails_path, 'r') as file:
        for line in file:
            emails.append(line.strip())

    #crear un menu con opciones Limpiar eventos, crear eventos, editar evento, eliminar evento
    while True:
        print('\n--- CALENDAR MANAGER ---')
        print('1. Listar eventos')
        print('2. Crear evento')
        print('3. Editar evento')
        print('4. Eliminar evento')
        print('5. Carga masiva de eventos')
        print('6. Limpiar eventos')
        print('7. Salir')
        print('------------------------')

        opcion = input('Seleccione una opción: ')

        if opcion == '1':
            calendar.listar_eventos()
        elif opcion == '2':
            summary = input('Ingrese el nombre del evento: ')
            start_time = input('Ingrese la fecha de inicio (YYYY-MM-DDTHH:MM:SS): ')
            end_time = input('Ingrese la fecha de fin (YYYY-MM-DDTHH:MM:SS): ')
            timezone='America/Guatemala'
            attendees = input('Ingrese los correos de los asistentes (separados por coma): ').split(',')

            calendar.create_event(summary, start_time, end_time, timezone, attendees)
        elif opcion == '3':
            while True:
                # lista los eventos
                calendar.listar_eventos()

                event_id = input('Ingrese el ID del evento: ')
                # con el id del evento se puede obtener el evento y mostrar la información a editar
                try:
                    event = calendar.service.events().get(calendarId='primary', eventId=event_id).execute()
                    break
                except HttpError as error:
                    print(f"Ocurrion un error al traer el evento: {error}")
                    continue

            actual_summary = event['summary']
            actual_start_time = event['start']['dateTime']
            actual_end_time = event['end']['dateTime']

            summary = input(f'Ingrese el nuevo nombre del evento ({actual_summary}): ') or actual_summary
            start_time = input(f'Ingrese la nueva fecha de inicio ({actual_start_time}): ') or actual_start_time
            end_time = input(f'Ingrese la nueva fecha de fin ({actual_end_time}): ') or actual_end_time

            try:
                calendar.update_event(event_id, summary, start_time, end_time)
                print('Evento actualizado con éxito')
            except HttpError as error:
                print(f"Ocurrion un error al actualizar el evento: {error}")

        elif opcion == '4':
            while True:
                calendar.listar_eventos()
                event_id = input('Ingrese el ID del evento a eliminar: ')
                try:
                    calendar.delete_event(event_id)
                    print('Evento eliminado con éxito')
                    break
                except HttpError as error:
                    print(f"Ocurrion un error al eliminar el evento: {error}")
                    continue
        elif opcion == '5':
            calendar.create_events_from_csv(os.path.join(os.path.dirname(__file__), "cursos.csv"))
            print('Eventos creados con éxito')

        elif opcion == '6':
            calendar.clear_all_events()
            print('Eventos eliminados con éxito')
        elif opcion == '7':
            break
        else:
            print('Opción inválida')

    print('¡Hasta luego!')