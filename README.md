# dnxpi
ASP.NET MVC Web application on Raspberry Pi

Step1:
Copy dnxpi to C:\PROGRAMS\ of the Raspberry Pi
Raspberry Pi Share can be access from your development computer using ip or machine name
Example
\\192.168.12\C$\PROGRAMS
or
\\minwinpc\C$\PROGRAMS

Step 2:
From your development machine using powershell
Enter-PsSession -ComputerName minwinpc -Credential minwinpc\Administrator
Set-Location "C:\PROGRAMS\DnxPi"
dnx web

js/SystemPerformance.js
var host = 'ws://minwinpc:8080/api/resourcemanager/systemperf';

//Change the minwinpc to your raspberry pc name or ip address
