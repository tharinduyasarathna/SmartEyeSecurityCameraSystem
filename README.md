# Smart Intelligent Eye Security Camara System
 * Object detection security camera system for home, an intelligent system for capturing, identifying, warning
and controlling unauthorized threaten objects or access to the premises.
<p align="center">
  <img src="https://github.com/Tharinduyasarathna27/SmartEyeSecurityCameraSystem/blob/master/src/assets/images/1.PNG"  width="720" height="340" >
</p>


## Prerequisites
 * Windows 10 
 * Angular CLI 6.0.8
 * Python 3.6 
 * Node 10.15.1 or higher version
 * npm 6.4.1 or higher version
 * Firebase account
 * NodeMCU ESP8266 board
 * LED or Buzzer
 * Web camera

## Deployement

First ensure that python 3.6 , Nodejs and Angular CLI 6.0.8 install on your computer.Create Empty firebase project and configure below things.
> 1. **Firebase Authentication** - Enable Email/Password Sign-in method.
> 2. **Firebase Database** 
>     1. **Cloud Firestore** - Update rules like below.
>         ```bash
>             service cloud.firestore {
>             match /databases/{database}/documents {
>          
>             match /users/{userId} {
>                  allow write, read //: if isOwner(userId);
>             }
>              match /images/{imageId} {
>                 allow write, read 
>             }
>              match /metadata/{imageId} {
>                  allow write, read 
>              }
>              match /videoUrl/{imageId} {
>                  allow write, read 
>              }
>             
>              function isOwner(userId) {
>                  return request.auth.uid == userId
>              }
>            }
>          }
>     2. **Realtime Database** - Update rules like below.
>         ```bash
>          {
>            "rules": {
>              ".read": true,
>              ".write": true
>            }
>          }

> 3. **Firebase Storage** - Update rules like below.
>> ```bash
>>      service firebase.storage {
>>         match /b/{bucket}/o {
>>          match /{allPaths=**} {
>>              allow read, write//: if request.auth != null;
>>            }
>>         }
>>      }

> 4. **Firebase SDK snippet** - Copy that file from your firebase project.
>> ```bash
>>    var firebaseConfig = {
>>       apiKey: "XXXXXXXXXXXXXXXXXXXXX",
>>       authDomain: "XXXXXX.firebaseapp.com",
>>       databaseURL: "https://XXXXXXX.firebaseio.com",
>>       projectId: "XXXXX-7b",
>>       storageBucket: "XXXXXX-7b.appspot.com",
>>       messagingSenderId: "YYYYYYYY",
>>       appId: "XXXXXXXXXXXXXXXX"
>>     };

>> Then paste it to below mentioned locations
>> ```bash
>> * Create environment.ts file on this  "Smart Eye Main Module/src/environments/environment.ts" path and paste on it.
>> * Navigate this "Smart Eye Main Module/modules/Object detection module/templates/index.html" path and paste it inside index.html file.

> #### Configure Alarm 
>> To configure alarm genaration we need NodeMCU ESP8266 board and LED/Buzzer.Inside **" module/IOT- alarm generation module/fire_test "** folder i put **fire_test.ino** file .It needs to be upload NodeMCU board and configure COMPort( NodeMCU board will provide relevent software for configure COMPort ) .After all things are done Connect LED/Buzzer through **GND and D3 pins** ( D3 is my pc COMPort pin)

> #### Start Application
>> Finally we can go for the deployment.Open Command prompt in windows and navigate the repo and run **deploymentScript.bat** file.

All modules are now up and running.Please visit your pc http://localhost:4200.

<p>
  <img src="https://github.com/Tharinduyasarathna27/SmartEyeSecurityCameraSystem/blob/master/src/assets/images/2.PNG"  width="410" height="210" >
  <img src="https://github.com/Tharinduyasarathna27/SmartEyeSecurityCameraSystem/blob/master/src/assets/images/3.PNG"  width="410" height="210" >
  <img src="https://github.com/Tharinduyasarathna27/SmartEyeSecurityCameraSystem/blob/master/src/assets/images/4.PNG"  width="410" height="210" >
  <img src="https://github.com/Tharinduyasarathna27/SmartEyeSecurityCameraSystem/blob/master/src/assets/images/5.PNG"  width="410" height="210" >
  <p align="center">
  <img src="https://github.com/Tharinduyasarathna27/SmartEyeSecurityCameraSystem/blob/master/src/assets/images/6.PNG"  width="410" height="210" >
</p>
</p>
