import requests
import json
import os

arrival = "2024-08-01" # arrival date
departure = "2024-08-02" # departure date
rate = "CORP" # Room rate
token = "put_default_token_here_if_needed"

try:
    with open(".nlb_token", 'r') as file:
        token = file.read().rstrip()
except FileNotFoundError:
    pass

api_url = "https://cube-api-reservation.mriyaresort.com/api/v1/ota-availability/2/"
response = requests.get(api_url)
response.json()

headers =  { "authority": "cube-api-reservation.mriyaresort.com",
  "accept": "application/json, text/plain, */*",
  "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
  "authorization": "NLB " + token,
  "cache-control": "no-cache",
  "content-type": "application/json",
  "origin": "https://reservation.mriyaresort.com",
  "pragma": "no-cache",
  "referer": "https://reservation.mriyaresort.com/",
  "sec-ch-ua": 'Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "macOS",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"}

data = {"arrival":arrival,"departure":departure,"promo_code":"","rooms":[{"adults":2,"childs":[{"id":1,"code":"CA1","count":0},{"id":3,"code":"CA3","count":0}]}],"rate_flow":rate}
response = requests.post(api_url, json=data, headers=headers)

rooms = []
for key in response.json():
    try:
      rooms.append(key['name'])
    except:
      pass

answer = { "rooms": rooms, "code": response.status_code, "count": len(rooms), "rate": rate, "arrival": arrival, "departure": departure }
print(json.dumps(answer, ensure_ascii=False).encode('utf8').decode())

if response.status_code == 401: # delete token file if 401 code returned
   os.remove(".nlb_token")