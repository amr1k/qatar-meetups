# Introduction

This purpose of this section is to walk through the initial setup of the device and the creation of a Google Cloud account.

## Hardware Requirements

The following components are included in the kit that you have received:

Note: If you did not receive a kit you can procure the following parts:

| Component                   | Description                                                                                                                 | Quantity |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| Node MCU ESP8266            | The ESP8266 is a low-cost Wi-Fi microchip, <br>with built-in TCP/IP networking software, <br>and microcontroller capability | 1        |
| DHT11                       | Temperature and Humidity Sensor                                                                                             | 1        |
| MicroUSB Cable              | Not Included                                                                                                                | 1        |
| USB Power Adaptor (3.3v-5v) | Required to make the board run without being <br>connected to the laptop                                                    | 1        |

In addition to the above a laptop/pc running MacOS, Windows or Linux is required to program the device and to interact with the Google Cloud Console.

## Device Setup

The ESP8266 will be programmed using the Arduino IDE, therefore in this section we will go through the following:

1. Install the Arduino IDE
2. Install the required libraries
3. Run the blink application aka the 'Hello World'

### Install the Arduino IDE

The Arduino IDE can be downloaded from the following page:

https://www.arduino.cc/en/software

You may refer to the following documentation for step-by-step instructions:

https://docs.arduino.cc/software/ide-v2/tutorials/getting-started/ide-v2-downloading-and-installing

### Setting up Arduino

1. Install the ESP8266 Boards:

### Download the DHT Libary

Tools --> Boards --> Boards Manager --> Search for ESP8266 --> Install ESP8266 Boards

2. Install the DHT Adafruit libraries:

   ### Download the DHT Libary

   Download the DHT library, this is required to interface with DHT sensor that will be using for measuring the temperature

   https://github.com/adafruit/DHT-sensor-library/archive/refs/tags/1.4.4.zip

   ### Importing a .zip Library

   In the menu bar, go to Sketch > Include Library > Add .ZIP Library.

   You will be prompted to select the library you want to add. Navigate to the .zip file’s location and open it.

   If you’re using Arduino IDE 2, you may need to restart the IDE for the library to be available.

## GCP Account Creation

After you set up the Arduino IDE, it is time to set up your free Google Cloud Platform Account (GCP). With the free tier account, you get access to 20+ products and $300 worth of credits valid for 90 days. This should be more than enough to get you started in the woorl of Google Cloud.

In order to create you GCP free tier account, navigate to the following page (http://bit.ly/3Daf1ZE) and click on the **Get started for free** button. Follow the instructions to get your account set up. You might need to provide some credit card details. This is just for validation purposes; you credit card will not be charged during the signing up process. One you complete this process, you will be redirected to the Google Cloud console where you can start deploying the necessary resources to complete this project.


