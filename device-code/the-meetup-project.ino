#include <DHT_U.h>

// These libraries are bundled and does not need to be installed.
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

//GLOBAL VARS
#define URL "<replace-me>" //the endpoint is senddata
#define SSID "<replace-me>"
#define PSK "<replace-me>"
//This is the key used to authenticate with the backend
#define APIKEY "<replace-me>"
#define DEVICE_TYPE "DHT11"
#define DEVICE_NAME "meetup-demo"
#define HTTP true
/* --------------------------------=
    Setup WiFi
---------------------------------- */
ESP8266WiFiMulti WiFiMulti;


/* --------------------------------=
    Setup SSL
---------------------------------- */
// Fingerprint for demo URL, expires on June 2, 2021, needs to be updated well before this date
const uint8_t fingerprint[20] = {0x40, 0xaf, 0x00, 0x6b, 0xec, 0x90, 0x22, 0x41, 0x8e, 0xa3, 0xad, 0xfa, 0x1a, 0xe8, 0x25, 0x41, 0x1d, 0x1a, 0x54, 0xb3};


/* --------------------------------=
    Setup Temperature Sensor
---------------------------------- */
#define DHTPIN 2     // Digital pin connected to the DHT sensor 
// Feather HUZZAH ESP8266 note: use pins 3, 4, 5, 12, 13 or 14 --
// Pin 15 can work but DHT must be disconnected during program upload.

#define DHTTYPE    DHT11     // DHT 11

// See guide for details on sensor wiring and usage:
//   https://learn.adafruit.com/dht/overview

DHT_Unified dht(DHTPIN, DHTTYPE);

uint32_t delayMS;
String message,m;


// The type of data that we want to extract from the page
String temp;
String humidity;

HTTPClient http;
WiFiClient client;
void setup() {
  
  Serial.begin(9600);

  //Flushing Serial
  Serial.println();
  Serial.println();
  Serial.println();

  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  //Starting WiFi
  Serial.println("Setting up WiFi...");
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(SSID, PSK);

  while((WiFiMulti.run() != WL_CONNECTED)){
    Serial.println(".");
  }

  Serial.println(WiFi.localIP());

  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);

  // Initialize device.
  Serial.println(F("Initialising Temperature Sensor..."));
  dht.begin();
  // Print temperature sensor details.
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);
  dht.humidity().getSensor(&sensor);
 
  delayMS = sensor.min_delay / 1000;
}

void loop() {
  if((WiFiMulti.run() == WL_CONNECTED)){
    // Delay between measurements.
    delay(delayMS);
    // Get temperature event and print its value.
    sensors_event_t event;
    dht.temperature().getEvent(&event);
    if (isnan(event.temperature)) {
      Serial.println(F("Error reading temperature!"));
    }
    else {
      Serial.print(F("Temperature: "));
      Serial.print(event.temperature);
      Serial.println(F("°C"));
      temp = String(event.temperature);
    }
    // Get humidity event and print its value.
    dht.humidity().getEvent(&event);
    if (isnan(event.relative_humidity)) {
      Serial.println(F("Error reading humidity!"));
    }
    else {
      Serial.print(F("Humidity: "));
      Serial.print(event.relative_humidity);
      Serial.println(F("%"));
      humidity = String(event.relative_humidity);
    }

    m="{\"devicename\":\""+String(DEVICE_NAME)+"\",\"devicetype\":\""+String(DEVICE_TYPE)+"\",\"temperature\":\""+String(temp)+"\",\"humidity\""+":\""+String(humidity)+"\"}";
    
      //std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);

      //client->setFingerprint(fingerprint);
      // Or, if you happy to ignore the SSL certificate, then use the following line instead:
      //client->setInsecure();

      if (http.begin(client, URL)) {  // HTTP

      
        Serial.print("[HTTP] POST...\n");
        // start connection and send HTTP header
        http.addHeader("Content-Type", "application/json");
        http.addHeader("key", APIKEY);
        Serial.println(m);
        int httpCode = http.POST(m);

        // httpCode will be negative on error
        if (httpCode > 0) {
          // HTTP header has been send and Server response header has been handled
          Serial.printf("[HTTP] POST... code: %d\n", httpCode);

          // file found at server
          if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
            String payload = http.getString();
            Serial.println(payload);
          }
        } else {
          Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }
        //http.end();
    } else {
      Serial.printf("[HTTP} Unable to connect\n");
    }
    
    Serial.println("Wait 10 Minutes before next reading...");
    //delay(10000);
    delay(600000);
  }
}
