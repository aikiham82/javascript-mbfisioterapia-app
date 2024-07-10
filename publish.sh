#!/bin/bash
export ANDROID_HOME=/home/abraham/Descargas/android-sdk-linux/
cordova build --release android
/usr/lib/jvm/jdk1.8.0_60/bin/jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /home/abraham/Proyectos/Utilidades/Ionic/presencea/my-release-key.keystore /home/abraham/Proyectos/Utilidades/Ionic/presencea/platforms/android/build/outputs/apk/android-release-unsigned.apk presencea
rm /home/abraham/Proyectos/Utilidades/Ionic/presencea/platforms/android/build/outputs/apk/presencea.apk
$ANDROID_HOME/build-tools/19.1.0/zipalign -v 4 /home/abraham/Proyectos/Utilidades/Ionic/presencea/platforms/android/build/outputs/apk/android-release-unsigned.apk /home/abraham/Proyectos/Utilidades/Ionic/presencea/platforms/android/build/outputs/apk/presencea.apk 

