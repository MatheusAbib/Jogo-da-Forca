 let selectedWord = "";
  let displayedWord = [];
  let wrongGuesses = 0;
  const maxGuesses = 6;
  let soundEnabled = true;
  let animationFrameId;

  const wordDisplay = document.getElementById("wordDisplay");
  const keyboard = document.getElementById("keyboard");
  const wrongDisplay = document.getElementById("wrongGuesses");
  const message = document.getElementById("message");
  const restartBtn = document.getElementById("restartBtn");
  const hangmanFigure = document.querySelector(".hangman-figure");
  const hintText = document.getElementById("hintText");
  const soundBtn = document.getElementById("soundBtn");
  const hearts = document.querySelectorAll(".heart");
  const particlesContainer = document.querySelector(".particles");
  const fireCanvas = document.getElementById("fireCanvas");
  const fireBackground = document.querySelector(".fire-background");

  // Sound effects
const sounds = {
  correct: new Audio('./correct-156911.mp3'),
  wrong: new Audio('./error-002-337159.mp3'),
  win: new Audio('./you-win-sequence-3-183950.mp3'),
  lose: new Audio('./Beyoncé - Haunted extended ending (slowed) [LAD6yWu-nNQ].mp3'),
  click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'),
  fire: new Audio('./fire-sound-334130.mp3')
};

wordListB64 = "W3sid29yZCI6ImFiaXNzYWwiLCJkZXNjcmlwdGlvbiI6IlJlbGF0aXZvIGEgZ3JhbmRlcyBwcm9mdW5kaWRhZGVzLCBlc3BlY2lhbG1lbnRlIG9jZeJuaWNhcyJ9LHsid29yZCI6ImFjYWxhbnRvIiwiZGVzY3JpcHRpb24iOiJDYW7n428gcGFyYSBlbWJhbGFyIGJlYupzOyBhdG8gZGUgYWNhbGVudGFyIn0seyJ3b3JkIjoiYWx0aXZleiIsImRlc2NyaXB0aW9uIjoiUXVhbGlkYWRlIGRlIHF1ZW0g6SBhbHRpdm8sIG9yZ3VsaG9zbyBkZSBtYW5laXJhIG5vYnJlIn0seyJ3b3JkIjoiYWx1c2l2byIsImRlc2NyaXB0aW9uIjoiUXVlIGZheiBhbHVz428sIHF1ZSBzZSByZWZlcmUgaW5kaXJldGFtZW50ZSBhIGFsZ28ifSx7IndvcmQiOiJhcG9nZXUiLCJkZXNjcmlwdGlvbiI6IlBvbnRvIG1haXMgYWx0byBkZSBkZXNlbnZvbHZpbWVudG8gb3Ugc3VjZXNzbyJ9LHsid29yZCI6ImFyZGlsb3NvIiwiZGVzY3JpcHRpb24iOiJBc3R1dG8sIGVzcGVydG8sIHF1ZSBhZ2UgY29tIGRpc3NpbXVsYefjbyJ9LHsid29yZCI6ImFzY2Vuc+NvIiwiZGVzY3JpcHRpb24iOiJBdG8gZGUgc3ViaXIgb3UgZWxldmFyLXNlOyBwcm9ncmVzc28gaW1wb3J0YW50ZSJ9LHsid29yZCI6ImFzc29tYnJvIiwiZGVzY3JpcHRpb24iOiJFc3BhbnRvLCBhZG1pcmHn428gZXh0cmVtYTsgcG9kZSBzaWduaWZpY2FyIHRhbWLpbSBmYW50YXNtYSJ9LHsid29yZCI6ImFzdPpjaWEiLCJkZXNjcmlwdGlvbiI6IkhhYmlsaWRhZGUgcGFyYSByZXNvbHZlciBzaXR1Yef1ZXMgY29tIGludGVsaWfqbmNpYSBwcuF0aWNhIn0seyJ3b3JkIjoiYmFsdWFydGUiLCJkZXNjcmlwdGlvbiI6IkVzdHJ1dHVyYSBkZWZlbnNpdmE7IGZpZ3VyYWRhbWVudGUsIHByb3Rl5+NvIHPzbGlkYSJ9LHsid29yZCI6ImJv6m1pbyIsImRlc2NyaXB0aW9uIjoiUXVlIGxldmEgdmlkYSBkZXNwcmVvY3VwYWRhLCBlc3BlY2lhbG1lbnRlIGFydO1zdGljYSJ9LHsid29yZCI6ImJ1Y/NsaWNvIiwiZGVzY3JpcHRpb24iOiJSZWxhdGl2byDgIHZpZGEgY2FtcGVzdHJlIGlkZWFsaXphZGEsIHBhc3RvcmFsIn0seyJ3b3JkIjoiY2FuZGVudGUiLCJkZXNjcmlwdGlvbiI6IkJyaWxoYW50ZSwgYXJkZW50ZTsgYXNzdW50byBtdWl0byBhdHVhbCBlIGltcG9ydGFudGUifSx7IndvcmQiOiJjYXV0ZXJpemFyIiwiZGVzY3JpcHRpb24iOiJRdWVpbWFyIHRlY2lkbyBwYXJhIGZpbnMgbelkaWNvczsgZmlndXJhZGFtZW50ZSwgbWFyY2FyIHByb2Z1bmRhbWVudGUifSx7IndvcmQiOiJjZWxldW1hIiwiZGVzY3JpcHRpb24iOiJCYXJ1bGhvLCBjb25mdXPjbzsgZGViYXRlIGFjYWxvcmFkbyJ9LHsid29yZCI6ImNpbnplbCIsImRlc2NyaXB0aW9uIjoiRmVycmFtZW50YSBwYXJhIGVzY3VscGlyOyBmaWd1cmFkYW1lbnRlLCB0cmFiYWxoYXIgY29tIHByZWNpc+NvIn0seyJ3b3JkIjoiY29sb3NzbyIsImRlc2NyaXB0aW9uIjoiRXN04XR1YSBnaWdhbnRlc2NhOyBwZXNzb2Egb3UgY29pc2EgZGUgZ3JhbmRlIGltcG9ydOJuY2lhIn0seyJ3b3JkIjoiY29udHVuZGVudGUiLCJkZXNjcmlwdGlvbiI6IlF1ZSBwcm9kdXogZm9ydGUgaW1wYWN0bywgc2VqYSBm7XNpY28gb3UgYXJndW1lbnRhdGl2byJ9LHsid29yZCI6ImNvbnbpcyIsImRlc2NyaXB0aW9uIjoiUGlzbyBzdXBlcmlvciBkZSBuYXZpbzsgcGFsY28gZGUgZ3JhbmRlcyBldmVudG9zIG7hdXRpY29zIn0seyJ3b3JkIjoiY29yb2zhcmlvIiwiZGVzY3JpcHRpb24iOiJDb25jbHVz428gbPNnaWNhIHF1ZSBkZWNvcnJlIG5hdHVyYWxtZW50ZSBkZSBhbGdvIn0seyJ3b3JkIjoiZGVjculwaXRvIiwiZGVzY3JpcHRpb24iOiJNdWl0byB2ZWxobyBlIGVuZnJhcXVlY2lkbzsgZW0gYXZhbudhZG8gZXN0YWRvIGRlIGRldGVyaW9yYefjbyJ9LHsid29yZCI6ImRlc+1nbmlvIiwiZGVzY3JpcHRpb24iOiJQbGFubyBvdSBwcm9w83NpdG8gc2VjcmV0bzsgaW50ZW7n428gb2N1bHRhIn0seyJ3b3JkIjoiZGVzdGVtaWRvIiwiZGVzY3JpcHRpb24iOiJRdWUgbuNvIHRlbSBtZWRvLCBjb3Jham9zbywgaW50culwaWRvIn0seyJ3b3JkIjoiZGV2YW5laW8iLCJkZXNjcmlwdGlvbiI6IlBlbnNhbWVudG8gZGlzdHJh7WRvOyBzb25obyBhY29yZGFkbyJ9LHsid29yZCI6ImVm6m1lcm8iLCJkZXNjcmlwdGlvbiI6IkRlIGN1cnRhIGR1cmHn428sIHBhc3NhZ2Vpcm8ifSx7IndvcmQiOiJlbWFyYW5oYWRvIiwiZGVzY3JpcHRpb24iOiJFbSBlc3RhZG8gY29uZnVzbzsgc2l0dWHn428gY29tcGxleGEgZSBkaWbtY2lsIn0seyJ3b3JkIjoiZXDtdG9tZSIsImRlc2NyaXB0aW9uIjoiUmVwcmVzZW50YefjbyBwZXJmZWl0YSBvdSByZXN1bW8gZXNzZW5jaWFsIGRlIGFsZ28ifSx7IndvcmQiOiJlcXXtdm9jbyIsImRlc2NyaXB0aW9uIjoiTWFsZGFkZSwgZXJybyBkZSBpbnRlcnByZXRh5+NvOyBzaXR1YefjbyBhbWLtZ3VhIn0seyJ3b3JkIjoiZXNj4XJuaW8iLCJkZXNjcmlwdGlvbiI6IlpvbWJhcmlhIG9mZW5zaXZhLCBkZWJvY2hlIG1hbGRvc28ifSx7IndvcmQiOiJlc2Ry+nh1bG8iLCJkZXNjcmlwdGlvbiI6IkVzdHJhbmhvLCBleGPqbnRyaWNvLCBmb3JhIGRvIGNvbXVtIn0seyJ3b3JkIjoiZXN0aWdtYSIsImRlc2NyaXB0aW9uIjoiTWFyY2EgZGUgdmVyZ29uaGE7IGNpY2F0cml6IGbtc2ljYSBvdSBlbW9jaW9uYWwifSx7IndvcmQiOiJlc3R1cGVmYXRvIiwiZGVzY3JpcHRpb24iOiJBdG9yZG9hZG8sIGV4dHJlbWFtZW50ZSBzdXJwcmVzbyJ9LHsid29yZCI6ImV4b3J0YefjbyIsImRlc2NyaXB0aW9uIjoiRGlzY3Vyc28gcGFyYSBlbmNvcmFqYXIgb3UgYWR2ZXJ0aXIgdmVlbWVudGVtZW50ZSJ9LHsid29yZCI6ImV4dWJlcmFudGUiLCJkZXNjcmlwdGlvbiI6IkNoZWlvIGRlIHZpZGEsIGVuZXJnaWEgZSBhYnVuZOJuY2lhIn0seyJ3b3JkIjoiZmlkZWRpZ25vIiwiZGVzY3JpcHRpb24iOiJDb25maeF2ZWwsIGRpZ25vIGRlIGbpLCB2ZXLtZGljbyJ9LHsid29yZCI6ImZsaWJ1c3RlaXJvIiwiZGVzY3JpcHRpb24iOiJQaXJhdGEgZG8gQ2FyaWJlOyBwZXNzb2EgYXZlbnR1cmVpcmEgZSBhdWRhY2lvc2EifSx7IndvcmQiOiJmdWxndXJhbnRlIiwiZGVzY3JpcHRpb24iOiJRdWUgYnJpbGhhIGludGVuc2FtZW50ZTsgcuFwaWRvIGUgaW1wcmVzc2lvbmFudGUifSx7IndvcmQiOiJncmFuZGlsb3F1ZW50ZSIsImRlc2NyaXB0aW9uIjoiUXVlIGZhbGEgZGUgbW9kbyBwb21wb3NvIG91IGV4YWdlcmFkbyJ9LHsid29yZCI6ImjpZ2lyYSIsImRlc2NyaXB0aW9uIjoiRnVnYSBkZSBNYW9t6SBtYXJjYW5kbyBvIGlu7WNpbyBkbyBjYWxlbmThcmlvIGlzbOJtaWNvIn0seyJ3b3JkIjoiaGVybel0aWNvIiwiZGVzY3JpcHRpb24iOiJDb21wbGV0YW1lbnRlIGZlY2hhZG87IGRpZu1jaWwgZGUgZW50ZW5kZXIifSx7IndvcmQiOiJpZO1saWNvIiwiZGVzY3JpcHRpb24iOiJQZXJmZWl0YW1lbnRlIHNlcmVubyBlIHBhY+1maWNvLCBjb21vIHVtIGlk7WxpbyJ9LHsid29yZCI6ImltcOF2aWRvIiwiZGVzY3JpcHRpb24iOiJRdWUgbuNvIGRlbW9uc3RyYSBtZWRvLCBjb3Jham9zbyJ9LHsid29yZCI6ImluZXhvcuF2ZWwiLCJkZXNjcmlwdGlvbiI6IkltcGxhY+F2ZWwsIHF1ZSBu428gY2VkZSBhIHBlZGlkb3MifSx7IndvcmQiOiJpbnPzbGl0byIsImRlc2NyaXB0aW9uIjoiSW5jb211bSwgZXN0cmFuaG8sIGZvcmEgZG8gb3JkaW7hcmlvIn0seyJ3b3JkIjoiaW50culwaWRvIiwiZGVzY3JpcHRpb24iOiJBdWRhY2lvc28sIGNvcmFqb3NvLCBkZXN0ZW1pZG8ifSx7IndvcmQiOiJqdWJpbG9zbyIsImRlc2NyaXB0aW9uIjoiQ2hlaW8gZGUgavpiaWxvLCBleHRyZW1hbWVudGUgYWxlZ3JlIn0seyJ3b3JkIjoibPpkaWNvIiwiZGVzY3JpcHRpb24iOiJSZWxhdGl2byBhbyBqb2dvOyBhdGl2aWRhZGUgcHJhemVyb3NhIGUgcmVjcmVhdGl2YSJ9LHsid29yZCI6Im1hZ27ibmltbyIsImRlc2NyaXB0aW9uIjoiR2VuZXJvc28sIHF1ZSBwZXJkb2Egb2ZlbnNhcyBjb20gbm9icmV6YSJ9LHsid29yZCI6Im1lbGxpZmx1byIsImRlc2NyaXB0aW9uIjoiRG9jZSBjb21vIG1lbDsgdm96IG91IG36c2ljYSBzdWF2ZSBlIGFncmFk4XZlbCJ9LHsid29yZCI6ImJyYXNpbCIsImRlc2NyaXB0aW9uIjoiTWFpb3IgcGHtcyBkYSBBbelyaWNhIGRvIFN1bCwgY29uaGVjaWRvIHBlbG8gQ2FybmF2YWwgZSBmdXRlYm9sIn0seyJ3b3JkIjoiY2FuYWThIiwiZGVzY3JpcHRpb24iOiJQYe1zIG5vcnRlLWFtZXJpY2FubyBjb20gdmFzdGFzIGZsb3Jlc3RhcyBlIGludmVybm9zIHJpZ29yb3NvcyJ9LHsid29yZCI6ImphcONvIiwiZGVzY3JpcHRpb24iOiJOYefjbyBpbnN1bGFyIGFzaeF0aWNhIGNvbmhlY2lkYSBwb3IgdGVjbm9sb2dpYSBlIHRyYWRp5/VlcyBtaWxlbmFyZXMifSx7IndvcmQiOiJpdOFsaWEiLCJkZXNjcmlwdGlvbiI6IlBh7XMgZXVyb3BldSBjb20gZm9ybWF0byBkZSBib3RhLCBiZXLnbyBkbyBJbXDpcmlvIFJvbWFubyJ9LHsid29yZCI6Im3peGljbyIsImRlc2NyaXB0aW9uIjoiUGHtcyBkYSBBbelyaWNhIGRvIE5vcnRlIGNvbSByaWNhIGhlcmFu52EgYXN0ZWNhIGUgbWFpYSJ9LHsid29yZCI6ImFyZ2VudGluYSIsImRlc2NyaXB0aW9uIjoiUGHtcyBzdWwtYW1lcmljYW5vIGZhbW9zbyBwZWxvIHRhbmdvIGUgZXhjZWxlbnRlIGNhcm5lIn0seyJ3b3JkIjoiYWxlbWFuaGEiLCJkZXNjcmlwdGlvbiI6IlBh7XMgZXVyb3BldSBs7WRlciBlbSBpbmT6c3RyaWEgZSBjb25oZWNpZG8gcGVsYSBPa3RvYmVyZmVzdCJ9LHsid29yZCI6ImF1c3Ry4WxpYSIsImRlc2NyaXB0aW9uIjoiQ29udGluZW50ZS1pbGhhIG5vIGhlbWlzZulyaW8gc3VsIGNvbSBmYXVuYSD6bmljYSBjb21vIGNhbmd1cnVzIn0seyJ3b3JkIjoiZWdpdG8iLCJkZXNjcmlwdGlvbiI6IlBh7XMgYWZyaWNhbm8gY29tIHBpcuJtaWRlcyBlIGhpc3TzcmlhIGZhcmH0bmljYSBtaWxlbmFyIn0seyJ3b3JkIjoi7W5kaWEiLCJkZXNjcmlwdGlvbiI6IlBh7XMgYXNp4XRpY28gcG9wdWxvc28gY29tIGRpdmVyc2lkYWRlIGN1bHR1cmFsIGUgZXNwaXJpdHVhbCJ9LHsid29yZCI6InL6c3NpYSIsImRlc2NyaXB0aW9uIjoiTWFpb3IgcGHtcyBkbyBtdW5kbyBlbSBleHRlbnPjbyB0ZXJyaXRvcmlhbCJ9LHsid29yZCI6ImZyYW7nYSIsImRlc2NyaXB0aW9uIjoiUGHtcyBldXJvcGV1IGZhbW9zbyBwZWxhIFRvcnJlIEVpZmZlbCBlIGdhc3Ryb25vbWlhIHJlZmluYWRhIn0seyJ3b3JkIjoiZXNwYW5oYSIsImRlc2NyaXB0aW9uIjoiUGHtcyBpYulyaWNvIGNvbmhlY2lkbyBwZWxvIGZsYW1lbmNvIGUgYXJxdWl0ZXR1cmEgZGUgR2F1ZO0ifSx7IndvcmQiOiJjaGluYSIsImRlc2NyaXB0aW9uIjoiUGHtcyBtYWlzIHBvcHVsb3NvIGRvIG11bmRvIGNvbSBncmFuZGUgY3Jlc2NpbWVudG8gZWNvbvRtaWNvIn0seyJ3b3JkIjoiaG9sYW5kYSIsImRlc2NyaXB0aW9uIjoiUGHtcyBldXJvcGV1IGJhaXhvIGNvbmhlY2lkbyBwb3IgbW9pbmhvcyBkZSB2ZW50byBlIHR1bGlwYXMifSx7IndvcmQiOiJzdWnnYSIsImRlc2NyaXB0aW9uIjoiUGHtcyBhbHBpbm8gZXVyb3BldSBmYW1vc28gcG9yIHJlbPNnaW9zIGUgY2hvY29sYXRlcyJ9LHsid29yZCI6InN1ZWNpYSIsImRlc2NyaXB0aW9uIjoiUGHtcyBu83JkaWNvIGNvbmhlY2lkbyBwZWxvIFBy6m1pbyBOb2JlbCBlIGRlc2lnbiBtb2Rlcm5vIn0seyJ3b3JkIjoibm9ydWVnYSIsImRlc2NyaXB0aW9uIjoiUGHtcyBlc2NhbmRpbmF2byBjb20gZmlvcmRlcyBlc3BldGFjdWxhcmVzIGUgYWx07XNzaW1vIElESCJ9LHsid29yZCI6ImdyZWNpYSIsImRlc2NyaXB0aW9uIjoiQmVy528gZGEgZGVtb2NyYWNpYSBlIGZpbG9zb2ZpYSBvY2lkZW50YWwgbmEgQW50aWd1aWRhZGUifSx7IndvcmQiOiJ0dXJxdWlhIiwiZGVzY3JpcHRpb24iOiJQYe1zIGV1cm9hc2nhdGljbyBjb20gcmljYSBoaXN083JpYSBvdG9tYW5hIGUgYml6YW50aW5hIn0seyJ3b3JkIjoicG9ydHVnYWwiLCJkZXNjcmlwdGlvbiI6IlBh7XMgaWLpcmljbyBxdWUgY29sb25pem91IG8gQnJhc2lsIG5vIHPpY3VsbyBYVkkifSx7IndvcmQiOiJjdWJhIiwiZGVzY3JpcHRpb24iOiJNYWlvciBpbGhhIGRvIENhcmliZSwgY29uaGVjaWRhIHBvciBjaGFydXRvcyBlIHJldm9sdefjbyJ9LHsid29yZCI6ImNvbG9tYmlhIiwiZGVzY3JpcHRpb24iOiJQYe1zIHN1bC1hbWVyaWNhbm8gY29tIGNhZukgZGUgcXVhbGlkYWRlIGUgY3VsdHVyYSB2aWJyYW50ZSJ9LHsid29yZCI6InBlcnUiLCJkZXNjcmlwdGlvbiI6IlBh7XMgYW5kaW5vIGNvbSBz7XRpbyBhcnF1ZW9s82dpY28gZGUgTWFjaHUgUGljY2h1In0seyJ3b3JkIjoidmVuZXp1ZWxhIiwiZGVzY3JpcHRpb24iOiJQYe1zIHN1bC1hbWVyaWNhbm8gY29tIGFzIG1haW9yZXMgcmVzZXJ2YXMgZGUgcGV0cvNsZW8ifSx7IndvcmQiOiJjaGlsZSIsImRlc2NyaXB0aW9uIjoiUGHtcyBsb25nbyBlIGVzdHJlaXRvIGVudHJlIEFuZGVzIGUgUGFj7WZpY28gbmEgQW3pcmljYSBkbyBTdWwifSx7IndvcmQiOiJib2xpdmlhIiwiZGVzY3JpcHRpb24iOiJQYe1zIGFuZGlubyBzZW0gbGl0b3JhbCBjb20gZ3JhbmRlIHBvcHVsYefjbyBpbmTtZ2VuYSJ9LHsid29yZCI6InBhcmFndWFpIiwiZGVzY3JpcHRpb24iOiJQYe1zIHN1bC1hbWVyaWNhbm8gY29uaGVjaWRvIHBvciBDaXVkYWQgZGVsIEVzdGUgZSBmdXRlYm9sIn0seyJ3b3JkIjoidXJ1Z3VhaSIsImRlc2NyaXB0aW9uIjoiUGVxdWVubyBwYe1zIHN1bC1hbWVyaWNhbm8gY29tIGFsdG9zIO1uZGljZXMgZGUgZGVzZW52b2x2aW1lbnRvIn0seyJ3b3JkIjoiZXF1YWRvciIsImRlc2NyaXB0aW9uIjoiUGHtcyBjb3J0YWRvIHBlbGEgbGluaGEgZG8gRXF1YWRvciBjb20gYmlvZGl2ZXJzaWRhZGUg+m5pY2EifSx7IndvcmQiOiJlaW5zdGVpbiIsImRlc2NyaXB0aW9uIjoiRu1zaWNvIGFsZW3jbyBjcmlhZG9yIGRhIHRlb3JpYSBkYSByZWxhdGl2aWRhZGUifSx7IndvcmQiOiJkYXJ3aW4iLCJkZXNjcmlwdGlvbiI6Ik5hdHVyYWxpc3RhIGluZ2zqcyBxdWUgZm9ybXVsb3UgYSB0ZW9yaWEgZGEgZXZvbHXn428ifSx7IndvcmQiOiJtb3phcnQiLCJkZXNjcmlwdGlvbiI6IkNvbXBvc2l0b3IgYXVzdHLtYWNvIHByb2TtZ2lvIGRvIHBlcu1vZG8gY2zhc3NpY28ifSx7IndvcmQiOiJiZWV0aG92ZW4iLCJkZXNjcmlwdGlvbiI6IkfqbmlvIG11c2ljYWwgYWxlbeNvIHF1ZSBjb21w9HMgbWVzbW8gc3VyZG8ifSx7IndvcmQiOiJwaWNhc3NvIiwiZGVzY3JpcHRpb24iOiJBcnRpc3RhIGVzcGFuaG9sIHBpb25laXJvIGRvIGN1YmlzbW8gbmEgcGludHVyYSJ9LHsid29yZCI6InZhbmdvZ2giLCJkZXNjcmlwdGlvbiI6IlBpbnRvciBob2xhbmTqcyBw83MtaW1wcmVzc2lvbmlzdGEgZGUgJ05vaXRlIEVzdHJlbGFkYScifSx7IndvcmQiOiJzaGFrZXNwZWFyZSIsImRlc2NyaXB0aW9uIjoiTWFpb3IgZHJhbWF0dXJnbyBpbmds6nMsIGF1dG9yIGRlICdIYW1sZXQnIGUgJ1JvbWV1IGUgSnVsaWV0YScifSx7IndvcmQiOiJwZWzpIiwiZGVzY3JpcHRpb24iOiJDb25zaWRlcmFkbyBwb3IgbXVpdG9zIG8gbWFpb3Igam9nYWRvciBkZSBmdXRlYm9sIGRlIHRvZG9zIG9zIHRlbXBvcyJ9LHsid29yZCI6Im1hcmlseW4iLCJkZXNjcmlwdGlvbiI6Is1jb25lIGhvbGx5d29vZGlhbm8gZG9zIGFub3MgNTAsIHPtbWJvbG8gc2V4dWFsIGV0ZXJubyJ9LHsid29yZCI6Im1hZG9ubmEiLCJkZXNjcmlwdGlvbiI6IlJhaW5oYSBkbyBwb3AgcXVlIHJldm9sdWNpb25vdSBhIG36c2ljYSBub3MgYW5vcyA4MCBlIDkwIn0seyJ3b3JkIjoiZWx2aXMiLCJkZXNjcmlwdGlvbiI6IlJlaSBkbyByb2NrLCDtY29uZSBjdWx0dXJhbCBkb3MgYW5vcyA1MCBlIDYwIn0seyJ3b3JkIjoiZnJlZGRpZSIsImRlc2NyaXB0aW9uIjoiVm9jYWxpc3RhIGxlbmThcmlvIGRhIGJhbmRhIFF1ZWVuLCBhdXRvciBkZSAnQm9oZW1pYW4gUmhhcHNvZHknIn0seyJ3b3JkIjoiam9icyIsImRlc2NyaXB0aW9uIjoiVmlzaW9u4XJpbyBjby1mdW5kYWRvciBkYSBBcHBsZSBlIHBpb25laXJvIGRhIGNvbXB1dGHn428gcGVzc29hbCJ9LHsid29yZCI6ImdhbmRoaSIsImRlc2NyaXB0aW9uIjoiTO1kZXIgcGFjaWZpc3RhIHF1ZSBsaWJlcnRvdSBhIM1uZGlhIGRvIGNvbG9uaWFsaXNtbyBicml04m5pY28ifSx7IndvcmQiOiJsdXRoZXJraW5nIiwiZGVzY3JpcHRpb24iOiJM7WRlciBkb3MgZGlyZWl0b3MgY2l2aXMgbm9zIEVVQSBjb20gZGlzY3Vyc28gJ0kgSGF2ZSBhIERyZWFtJyJ9LHsid29yZCI6Im1hbmRlbGEiLCJkZXNjcmlwdGlvbiI6IlPtbWJvbG8gZ2xvYmFsIGRlIGx1dGEgY29udHJhIG8gYXBhcnRoZWlkIG5hIMFmcmljYSBkbyBTdWwifSx7IndvcmQiOiJkaXNuZXkiLCJkZXNjcmlwdGlvbiI6IlBpb25laXJvIGRhIGFuaW1h5+NvIGUgY3JpYWRvciBkbyBpbXDpcmlvIGRvIGVudHJldGVuaW1lbnRvIn0seyJ3b3JkIjoidG9sa2llbiIsImRlc2NyaXB0aW9uIjoiRXNjcml0b3IgYnJpdOJuaWNvIGNyaWFkb3IgZG8gdW5pdmVyc28gZGUgJ08gU2VuaG9yIGRvcyBBbulpcycifSx7IndvcmQiOiJyb3dsaW5nIiwiZGVzY3JpcHRpb24iOiJBdXRvcmEgZGEgc+lyaWUgSGFycnkgUG90dGVyIHF1ZSByZXZvbHVjaW9ub3UgYSBsaXRlcmF0dXJhIGp1dmVuaWwifSx7IndvcmQiOiJuaWV0enNjaGUiLCJkZXNjcmlwdGlvbiI6IkZpbPNzb2ZvIGFsZW3jbyBxdWUgZGVjbGFyb3UgJ0RldXMgZXN04SBtb3J0bycifSx7IndvcmQiOiJtYXJpZWN1cmllIiwiZGVzY3JpcHRpb24iOiJDaWVudGlzdGEgcGlvbmVpcmEgbm8gZXN0dWRvIGRhIHJhZGlvYXRpdmlkYWRlLCBOb2JlbCBlbSBG7XNpY2EgZSBRde1taWNhIn0seyJ3b3JkIjoidGVzbGEiLCJkZXNjcmlwdGlvbiI6IkludmVudG9yIHZpc2lvbuFyaW8gZGUgc2lzdGVtYXMgZWzpdHJpY29zIGRlIGNvcnJlbnRlIGFsdGVybmFkYSJ9LHsid29yZCI6ImVkaXNvbiIsImRlc2NyaXB0aW9uIjoiSW52ZW50b3IgcHJvbO1maWNvIGNvbSBtYWlzIGRlIDEuMDAwIHBhdGVudGVzLCBpbmNsdWluZG8gYSBs4m1wYWRhIn0seyJ3b3JkIjoiZGF3bmVybyIsImRlc2NyaXB0aW9uIjoiR+puaW8gcmVuYXNjZW50aXN0YSBpdGFsaWFubyBhdXRvciBkYSBNb25hIExpc2EgZSBpbnZlbnRvciB2aXNpb27hcmlvIn0seyJ3b3JkIjoiZnJldWQiLCJkZXNjcmlwdGlvbiI6IlBhaSBkYSBwc2ljYW7hbGlzZSBxdWUgcmV2b2x1Y2lvbm91IG8gZXN0dWRvIGRhIG1lbnRlIGh1bWFuYSJ9LHsid29yZCI6ImNoYXBsaW4iLCJkZXNjcmlwdGlvbiI6IkNpbmVhc3RhIGJyaXTibmljbyBjcmlhZG9yIGRvIHBlcnNvbmFnZW0gQ2FybGl0b3Mgbm8gY2luZW1hIG11ZG8ifSx7IndvcmQiOiJrdWJyaWNrIiwiZGVzY3JpcHRpb24iOiJEaXJldG9yIGRlIGNpbmVtYSBwZXJmZWNjaW9uaXN0YSBkZSAnMjAwMScgZSAnTGFyYW5qYSBNZWPibmljYScifSx7IndvcmQiOiJib3dpZSIsImRlc2NyaXB0aW9uIjoiQXJ0aXN0YSBtdXNpY2FsIGNhbWFsZfRuaWNvIHF1ZSByZWludmVudG91IHNldSBlc3RpbG8gZGl2ZXJzYXMgdmV6ZXMifSx7IndvcmQiOiJwYXJpcyIsImRlc2NyaXB0aW9uIjoiQ2lkYWRlIEx1eiwgY2FwaXRhbCBkYSBGcmFu52EgY29tIFRvcnJlIEVpZmZlbCBlIExvdXZyZSJ9LHsid29yZCI6InJvbWEiLCJkZXNjcmlwdGlvbiI6IkNpZGFkZSBFdGVybmEsIGNhcGl0YWwgZGEgSXThbGlhIGNvbSBDb2xpc2V1IGUgRm9udGFuYSBkaSBUcmV2aSJ9LHsid29yZCI6Im5vdmFpb3JxdWUiLCJkZXNjcmlwdGlvbiI6Ik1haW9yIGNpZGFkZSBkb3MgRVVBIGNvbSBFc3ThdHVhIGRhIExpYmVyZGFkZSBlIFRpbWVzIFNxdWFyZSJ9LHsid29yZCI6ImxvbmRyZXMiLCJkZXNjcmlwdGlvbiI6IkNhcGl0YWwgZG8gUmVpbm8gVW5pZG8gY29tIEJpZyBCZW4gZSBQYWzhY2lvIGRlIEJ1Y2tpbmdoYW0ifSx7IndvcmQiOiJ0b3F1aW8iLCJkZXNjcmlwdGlvbiI6IkNhcGl0YWwgZG8gSmFw428sIG1ldHLzcG9sZSBmdXR1cmlzdGEgY29tIHRyYWRp5/VlcyBhbnRpZ2FzIn0seyJ3b3JkIjoic2lkbmV5IiwiZGVzY3JpcHRpb24iOiJNYWlvciBjaWRhZGUgZGEgQXVzdHLhbGlhIGNvbSBpY/RuaWNvIE9wZXJhIEhvdXNlIn0seyJ3b3JkIjoibWFjaHVwaWNjaHUiLCJkZXNjcmlwdGlvbiI6IkNpZGFkZSBwZXJkaWRhIGRvcyBJbmNhcyBub3MgQW5kZXMgcGVydWFub3MifSx7IndvcmQiOiJncmFuZGVjYW5pb24iLCJkZXNjcmlwdGlvbiI6IkRlc2ZpbGFkZWlybyBpbWVuc28gZXNjdWxwaWRvIHBlbG8gUmlvIENvbG9yYWRvIG5vcyBFVUEifSx7IndvcmQiOiJwaXJhbWlkZXMiLCJkZXNjcmlwdGlvbiI6IkVzdHJ1dHVyYXMgbW9udW1lbnRhaXMgZG8gQW50aWdvIEVnaXRvIGNvbW8gdHVtYmFzIGZhcmH0bmljYXMifSx7IndvcmQiOiJwZXRyYSIsImRlc2NyaXB0aW9uIjoiQ2lkYWRlIHJvc2EgZXNjdWxwaWRhIGVtIHJvY2hhIG5hIEpvcmTibmlhLCBwYXRyaW30bmlvIG11bmRpYWwifSx7IndvcmQiOiJtdXJkb2NoaW5hIiwiZGVzY3JpcHRpb24iOiJHcmFuZGUgbXVyYWxoYSBjb25zdHJ17WRhIHBhcmEgcHJvdGVnZXIgYSBDaGluYSBhbnRpZ2EifSx7IndvcmQiOiJhbHBlcyIsImRlc2NyaXB0aW9uIjoiQ2FkZWlhIG1vbnRhbmhvc2EgZXVyb3BlaWEgY29tIHBpY29zIGNvYmVydG9zIGRlIG5ldmUifSx7IndvcmQiOiJhbWF6b25pYSIsImRlc2NyaXB0aW9uIjoiTWFpb3IgZmxvcmVzdGEgdHJvcGljYWwgZG8gbXVuZG8sIHB1bG3jbyBkbyBwbGFuZXRhIn0seyJ3b3JkIjoic2FoYXJhIiwiZGVzY3JpcHRpb24iOiJNYWlvciBkZXNlcnRvIHF1ZW50ZSBkbyBtdW5kbyBjb2JyaW5kbyBvIG5vcnRlIGRhIMFmcmljYSJ9LHsid29yZCI6Im5pYWdhcmEiLCJkZXNjcmlwdGlvbiI6IkZhbW9zYXMgY2F0YXJhdGFzIGVudHJlIEVVQSBlIENhbmFk4SJ9LHsid29yZCI6ImV2ZXJlc3QiLCJkZXNjcmlwdGlvbiI6IlBpY28gbWFpcyBhbHRvIGRvIG11bmRvIG5hIGNvcmRpbGhlaXJhIGRvIEhpbWFsYWlhIn0seyJ3b3JkIjoiZGlzbmV5IiwiZGVzY3JpcHRpb24iOiJQYXJxdWVzIHRlbeF0aWNvcyBmYW1vc29zIGNyaWFkb3MgcG9yIFdhbHQgRGlzbmV5In0seyJ3b3JkIjoiaG9sbHl3b29kIiwiZGVzY3JpcHRpb24iOiJEaXN0cml0byBkZSBMb3MgQW5nZWxlcyBzZWRlIGRhIGluZPpzdHJpYSBjaW5lbWF0b2dy4WZpY2EgYW1lcmljYW5hIn0seyJ3b3JkIjoidmVnYXMiLCJkZXNjcmlwdGlvbiI6IkNpZGFkZSBkbyBqb2dvIGUgZW50cmV0ZW5pbWVudG8gbm8gZGVzZXJ0byBkZSBOZXZhZGEifSx7IndvcmQiOiJkdWJhaSIsImRlc2NyaXB0aW9uIjoiQ2lkYWRlIGRvcyBFbWlyYWRvcyDBcmFiZXMgY29tIGFycmFuaGEtY+l1cyBmdXR1cmlzdGFzIn0seyJ3b3JkIjoidmVuZXppYSIsImRlc2NyaXB0aW9uIjoiQ2lkYWRlIGl0YWxpYW5hIGNvbnN0cnXtZGEgc29icmUgY2FuYWlzLCBmYW1vc2EgcGVsb3MgcGFzc2Vpb3MgZGUgZ/RuZG9sYSJ9LHsid29yZCI6ImJhcmNlbG9uYSIsImRlc2NyaXB0aW9uIjoiQ2lkYWRlIGVzcGFuaG9sYSBjb20gYXJxdWl0ZXR1cmEgbW9kZXJuaXN0YSBkZSBHYXVk7SJ9LHsid29yZCI6Imt5b3RvIiwiZGVzY3JpcHRpb24iOiJBbnRpZ2EgY2FwaXRhbCBkbyBKYXDjbyBjb20gdGVtcGxvcyB0cmFkaWNpb25haXMgZSBqYXJkaW5zIHplbiJ9LHsid29yZCI6ImFuZ2tvciIsImRlc2NyaXB0aW9uIjoiQ29tcGxleG8gZGUgdGVtcGxvcyBubyBDYW1ib2phLCBtYWlvciBtb251bWVudG8gcmVsaWdpb3NvIGRvIG11bmRvIn0seyJ3b3JkIjoibWFsZGl2YXMiLCJkZXNjcmlwdGlvbiI6IlBhcmHtc28gdHJvcGljYWwgbm8gT2NlYW5vIM1uZGljbyBjb20g4Wd1YXMgY3Jpc3RhbGluYXMifSx7IndvcmQiOiJmaW9yZGVzIiwiZGVzY3JpcHRpb24iOiJFbnNlYWRhcyBtYXJpbmhhcyBhbG9uZ2FkYXMgZW50cmUgbW9udGFuaGFzLCB07XBpY2FzIGRhIE5vcnVlZ2EifSx7IndvcmQiOiJjYXBhZG9jaWEiLCJkZXNjcmlwdGlvbiI6IlJlZ2njbyBkYSBUdXJxdWlhIGNvbSBmb3JtYef1ZXMgcm9jaG9zYXMg+m5pY2FzIGUgY2lkYWRlcyBzdWJ0ZXJy4m5lYXMifSx7IndvcmQiOiJzYW50b3JpbmkiLCJkZXNjcmlwdGlvbiI6IklsaGEgZ3JlZ2EgY29tIGFycXVpdGV0dXJhIGJyYW5jYSBlIGF6dWwgc29icmUgZmFs6XNpYXMifSx7IndvcmQiOiJpbGhhcGFzY29hIiwiZGVzY3JpcHRpb24iOiJJbGhhIGNoaWxlbmEgZmFtb3NhIHBvciBzdWFzIG1pc3Rlcmlvc2FzIGVzdOF0dWFzIG1vYWkifSx7IndvcmQiOiJjYXJpc23hdGljbyIsImRlc2NyaXB0aW9uIjoiUXVlIGF0cmFpIGUgY2F0aXZhIGFzIHBlc3NvYXMgbmF0dXJhbG1lbnRlIn0seyJ3b3JkIjoicGVyc3BpY2F6IiwiZGVzY3JpcHRpb24iOiJRdWUgcGVyY2ViZSBlIGNvbXByZWVuZGUgY29pc2FzIHJhcGlkYW1lbnRlIn0seyJ3b3JkIjoicmVzaWxpZW50ZSIsImRlc2NyaXB0aW9uIjoiQ2FwYXogZGUgc2UgcmVjdXBlcmFyIGRlIGFkdmVyc2lkYWRlcyJ9LHsid29yZCI6ImVtcOF0aWNvIiwiZGVzY3JpcHRpb24iOiJRdWUgc2UgY29sb2NhIG5vIGx1Z2FyIGRvIG91dHJvLCBjb21wcmVlbmRlbmRvIHNlbnRpbWVudG9zIGFsaGVpb3MifSx7IndvcmQiOiJhbHRyde1zdGEiLCJkZXNjcmlwdGlvbiI6IlF1ZSBwcmF0aWNhIG8gYWx0cnXtc21vLCBjb2xvY2FuZG8gb3Mgb3V0cm9zIGFudGVzIGRlIHNpIn0seyJ3b3JkIjoibWV082RpY28iLCJkZXNjcmlwdGlvbiI6IlF1ZSBhZ2UgY29tIG3pdG9kbywgZGUgZm9ybWEgb3JnYW5pemFkYSBlIHNpc3RlbeF0aWNhIn0seyJ3b3JkIjoiY3JpYXRpdm8iLCJkZXNjcmlwdGlvbiI6IlF1ZSB0ZW0gY2FwYWNpZGFkZSBkZSBjcmlhciwgaW52ZW50YXIsIGlub3ZhciJ9LHsid29yZCI6ImV4dHJvdmVydGlkbyIsImRlc2NyaXB0aW9uIjoiU29jaeF2ZWwsIHF1ZSBzZSB2b2x0YSBtYWlzIHBhcmEgbyBleHRlcmlvciBxdWUgcGFyYSBzaSBtZXNtbyJ9LHsid29yZCI6Im1hZ27ibmltbyIsImRlc2NyaXB0aW9uIjoiR2VuZXJvc28sIHF1ZSBwZXJkb2Egb2ZlbnNhcyBjb20gbm9icmV6YSBkZSBlc3Dtcml0byJ9LHsid29yZCI6InBlcnNldmVyYW50ZSIsImRlc2NyaXB0aW9uIjoiUXVlIHBlcnNpc3RlIGVtIHNldXMgb2JqZXRpdm9zIGFwZXNhciBkYXMgZGlmaWN1bGRhZGVzIn0seyJ3b3JkIjoic2luY2VybyIsImRlc2NyaXB0aW9uIjoiUXVlIGZhbGEgZSBhZ2UgY29tIHZlcmRhZGUsIHNlbSBmaW5naW1lbnRvIn0seyJ3b3JkIjoib3VzYWRvIiwiZGVzY3JpcHRpb24iOiJRdWUgdGVtIGNvcmFnZW0gcGFyYSBlbmZyZW50YXIgcmlzY29zIGUgZGVzYWZpb3MifSx7IndvcmQiOiJwcnVkZW50ZSIsImRlc2NyaXB0aW9uIjoiQ2F1dGVsb3NvLCBxdWUgYWdlIGNvbSBtb2RlcmHn428gZSBwcmVjYXXn428ifSx7IndvcmQiOiJz4WJpbyIsImRlc2NyaXB0aW9uIjoiUXVlIHRlbSBzYWJlZG9yaWEsIGNvbmhlY2ltZW50byBwcm9mdW5kbyBlIGJvbSBqdWxnYW1lbnRvIn0seyJ3b3JkIjoiaHVtaWxkZSIsImRlc2NyaXB0aW9uIjoiUXVlIG7jbyB0ZW0gb3JndWxobyBleGNlc3Npdm8sIHJlY29uaGVjZSBzdWFzIGxpbWl0Yef1ZXMifSx7IndvcmQiOiJhbWJpY2lvc28iLCJkZXNjcmlwdGlvbiI6IlF1ZSB0ZW0gZm9ydGUgZGVzZWpvIGRlIGFsY2Fu52FyIG9iamV0aXZvcyBlbGV2YWRvcyJ9LHsid29yZCI6ImlkZWFsaXN0YSIsImRlc2NyaXB0aW9uIjoiUXVlIHNlZ3VlIGlkZWFpcywgbXVpdGFzIHZlemVzIGNvbSBjZXJ0byBkZXNwcmV6byBwZWxvIHBy4XRpY28ifSx7IndvcmQiOiJj6XRpY28iLCJkZXNjcmlwdGlvbiI6IlF1ZSBkdXZpZGEgc2lzdGVtYXRpY2FtZW50ZSwgZXhpZ2luZG8gcHJvdmFzIHBhcmEgY3JlciJ9LHsid29yZCI6Im90aW1pc3RhIiwiZGVzY3JpcHRpb24iOiJRdWUgdGVuZGUgYSB2ZXIgbyBsYWRvIHBvc2l0aXZvIGRhcyBjb2lzYXMifSx7IndvcmQiOiJwZXNzaW1pc3RhIiwiZGVzY3JpcHRpb24iOiJRdWUgdGVuZGUgYSB2ZXIgbyBsYWRvIG5lZ2F0aXZvIGRhcyBjb2lzYXMifSx7IndvcmQiOiJwYWNpZW50ZSIsImRlc2NyaXB0aW9uIjoiUXVlIHNhYmUgZXNwZXJhciBlIHN1cG9ydGFyIGFkdmVyc2lkYWRlcyBzZW0gaXJyaXRh5+NvIn0seyJ3b3JkIjoiaW1wYWNpZW50ZSIsImRlc2NyaXB0aW9uIjoiUXVlIG7jbyB0b2xlcmEgZGVtb3JhcyBvdSBvYnN04WN1bG9zIn0seyJ3b3JkIjoic2Vuc+12ZWwiLCJkZXNjcmlwdGlvbiI6IlF1ZSBzZW50ZSBjb20gZmFjaWxpZGFkZSwgZW1vY2lvbmEtc2UgZmFjaWxtZW50ZSJ9LHsid29yZCI6InJhY2lvbmFsIiwiZGVzY3JpcHRpb24iOiJRdWUgYWdlIGJhc2VhZG8gbmEgcmF6428gbWFpcyBxdWUgbmFzIGVtb+f1ZXMifSx7IndvcmQiOiJlc3BvbnTibmVvIiwiZGVzY3JpcHRpb24iOiJRdWUgYWdlIG5hdHVyYWxtZW50ZSwgc2VtIHBsYW5lamFtZW50byBvdSBhcnRpZmljaWFsaWRhZGUifSx7IndvcmQiOiJjYWxjdWxpc3RhIiwiZGVzY3JpcHRpb24iOiJRdWUgcGxhbmVqYSBjdWlkYWRvc2FtZW50ZSBzdWFzIGHn9WVzLCBtdWl0YXMgdmV6ZXMgZGUgZm9ybWEgZnJpYSJ9LHsid29yZCI6InRlbXBlcmFtZW50YWwiLCJkZXNjcmlwdGlvbiI6IkRlIGh1bW9yIHZhcmnhdmVsLCBxdWUgbXVkYSBkZSBhdGl0dWRlIGZhY2lsbWVudGUifSx7IndvcmQiOiJzZWR1dG9yIiwiZGVzY3JpcHRpb24iOiJRdWUgYXRyYWkgZSBlbmNhbnRhLCBlc3BlY2lhbG1lbnRlIG5vIGNhbXBvIGFtb3Jvc28ifSx7IndvcmQiOiJkaXNjaXBsaW5hZG8iLCJkZXNjcmlwdGlvbiI6IlF1ZSBzZWd1ZSByZWdyYXMgZSBt6XRvZG9zIGNvbSByaWdvciBlIG9yZGVtIn0seyJ3b3JkIjoicGFydGl0dXJhIiwiZGVzY3JpcHRpb24iOiJSZXByZXNlbnRh5+NvIGdy4WZpY2EgZGEgbfpzaWNhIGNvbSBub3RhcyBlIHPtbWJvbG9zIn0seyJ3b3JkIjoibWVsb2RpYSIsImRlc2NyaXB0aW9uIjoiU3VjZXNz428gZGUgc29ucyBtdXNpY2FpcyBxdWUgZm9ybWFtIHVtYSBsaW5oYSBtdXNpY2FsIHJlY29uaGVj7XZlbCJ9LHsid29yZCI6Imhhcm1vbmlhIiwiZGVzY3JpcHRpb24iOiJDb21iaW5h5+NvIHNpbXVsdOJuZWEgZGUgbm90YXMgbXVzaWNhaXMgcXVlIHNvYW0gYWdyYWRhdmVsbWVudGUifSx7IndvcmQiOiJyaXRtbyIsImRlc2NyaXB0aW9uIjoiT3JnYW5pemHn428gdGVtcG9yYWwgZG9zIHNvbnMgbXVzaWNhaXMsIHBhZHLjbyBkZSBiYXRpZGFzIn0seyJ3b3JkIjoiYWNvcmRlIiwiZGVzY3JpcHRpb24iOiJDb25qdW50byBkZSB0cupzIG91IG1haXMgbm90YXMgdG9jYWRhcyBzaW11bHRhbmVhbWVudGUifSx7IndvcmQiOiJzb3BybyIsImRlc2NyaXB0aW9uIjoiSW5zdHJ1bWVudG9zIG11c2ljYWlzIHRvY2Fkb3MgY29tIGFyIGNvbW8gZmxhdXRhcyBlIHRyb21wZXRlcyJ9LHsid29yZCI6InBlcmN1c3PjbyIsImRlc2NyaXB0aW9uIjoiSW5zdHJ1bWVudG9zIHRvY2Fkb3MgcG9yIGJhdGlkYSwgY29tbyB0YW1ib3JlcyBlIHByYXRvcyJ9LHsid29yZCI6InNpbmZvbmlhIiwiZGVzY3JpcHRpb24iOiJDb21wb3Np5+NvIG11c2ljYWwgZXh0ZW5zYSBwYXJhIG9ycXVlc3RyYSwgZ2VyYWxtZW50ZSBlbSBxdWF0cm8gbW92aW1lbnRvcyJ9LHsid29yZCI6InNvbmF0YSIsImRlc2NyaXB0aW9uIjoiQ29tcG9zaefjbyBwYXJhIHVtIG91IHBvdWNvcyBpbnN0cnVtZW50b3MsIGdlcmFsbWVudGUgZW0gdHLqcyBvdSBxdWF0cm8gbW92aW1lbnRvcyJ9LHsid29yZCI6ImNvbmNlcnRvIiwiZGVzY3JpcHRpb24iOiJDb21wb3Np5+NvIG11c2ljYWwgcXVlIGRlc3RhY2EgdW0gc29saXN0YSBhY29tcGFuaGFkbyBwb3Igb3JxdWVzdHJhIn0seyJ3b3JkIjoi83BlcmEiLCJkZXNjcmlwdGlvbiI6IkRyYW1hIG11c2ljYWwgZW5jZW5hZG8gY29tIGNhbnRvcmVzIGUgb3JxdWVzdHJhIn0seyJ3b3JkIjoiY29yYWwiLCJkZXNjcmlwdGlvbiI6Ik36c2ljYSBjb21wb3N0YSBwYXJhIGNvcm8sIG11aXRhcyB2ZXplcyBjb20gdGVtYXMgcmVsaWdpb3NvcyJ9LHsid29yZCI6ImphenoiLCJkZXNjcmlwdGlvbiI6IkfqbmVybyBtdXNpY2FsIG9yaWdpbuFyaW8gZG9zIEVVQSBjb20gaW1wcm92aXNh5+NvIGUgcml0bW9zIGNvbXBsZXhvcyJ9LHsid29yZCI6ImJsdWVzIiwiZGVzY3JpcHRpb24iOiJH6m5lcm8gbXVzaWNhbCBkZSBvcmlnZW0gYWZyby1hbWVyaWNhbmEgY29tIGVzdHJ1dHVyYSBkZSBkb3plIGNvbXBhc3NvcyJ9LHsid29yZCI6InJvY2siLCJkZXNjcmlwdGlvbiI6IkfqbmVybyBtdXNpY2FsIHBvcHVsYXIgc3VyZ2lkbyBub3MgYW5vcyA1MCBjb20gZ3VpdGFycmEgZWzpdHJpY2EifSx7IndvcmQiOiJzYW1iYSIsImRlc2NyaXB0aW9uIjoiR+puZXJvIG11c2ljYWwgYnJhc2lsZWlybyBjb20gcmHtemVzIGFmcmljYW5hcywgc+1tYm9sbyBkbyBDYXJuYXZhbCJ9LHsid29yZCI6ImJvc3NhIiwiZGVzY3JpcHRpb24iOiJFc3RpbG8gbXVzaWNhbCBicmFzaWxlaXJvIHF1ZSBtaXN0dXJhIHNhbWJhIGUgamF6eiwgcG9wdWxhcml6YWRvIG5vcyBhbm9zIDYwIn0seyJ3b3JkIjoiZnVuayIsImRlc2NyaXB0aW9uIjoiR+puZXJvIG11c2ljYWwgY29tIGJhdGlkYSBmb3J0ZSBlIOpuZmFzZSBubyBncm9vdmUifSx7IndvcmQiOiJyZWdnYWUiLCJkZXNjcmlwdGlvbiI6IkfqbmVybyBtdXNpY2FsIGphbWFpY2FubyBjb20gYmF0aWRhIGNhcmFjdGVy7XN0aWNhIGUgbWVuc2FnZW5zIHNvY2lhaXMifSx7IndvcmQiOiJoaXBob3AiLCJkZXNjcmlwdGlvbiI6Ik1vdmltZW50byBjdWx0dXJhbCBxdWUgaW5jbHVpIHJhcCwgREppbmcsIGJyZWFrZGFuY2UgZSBncmFmZml0aSJ9LHsid29yZCI6InNlcnRhbmVqbyIsImRlc2NyaXB0aW9uIjoiR+puZXJvIG11c2ljYWwgYnJhc2lsZWlybyBjb20gcmHtemVzIGNhaXBpcmFzLCBtdWl0byBwb3B1bGFyIG5vIGludGVyaW9yIn0seyJ3b3JkIjoiZm9ycvMiLCJkZXNjcmlwdGlvbiI6IkfqbmVybyBtdXNpY2FsIGUgZGFu52EgdO1waWNhIGRvIE5vcmRlc3RlIGJyYXNpbGVpcm8ifSx7IndvcmQiOiJwYWdvZGUiLCJkZXNjcmlwdGlvbiI6IkVzdGlsbyBtdXNpY2FsIGJyYXNpbGVpcm8gZGVyaXZhZG8gZG8gc2FtYmEsIGNvbSBpbnN0cnVtZW50b3MgY29tbyB0YW504yBlIGJhbmpvIn0seyJ3b3JkIjoibXBiIiwiZGVzY3JpcHRpb24iOiJN+nNpY2EgUG9wdWxhciBCcmFzaWxlaXJhLCBtb3ZpbWVudG8gcXVlIG1pc3R1cmEgdHJhZGnn428gZSBpbm92YefjbyJ9LHsid29yZCI6InRyb3ZhZG9yIiwiZGVzY3JpcHRpb24iOiJDb21wb3NpdG9yIGUgY2FudG9yIG1lZGlldmFsOyBtb2Rlcm5hbWVudGUsIGNhbnRvciBkZSBt+nNpY2EgcmVnaW9uYWwifSx7IndvcmQiOiJjcm9vbmVyIiwiZGVzY3JpcHRpb24iOiJDYW50b3IgcXVlIGludGVycHJldGEgY2Fu5/VlcyByb23ibnRpY2FzIGNvbSBlc3RpbG8gc3VhdmUifSx7IndvcmQiOiJjb3ZlciIsImRlc2NyaXB0aW9uIjoiVmVyc+NvIGRlIHVtYSBt+nNpY2Egb3JpZ2luYWxtZW50ZSBncmF2YWRhIHBvciBvdXRybyBhcnRpc3RhIn0seyJ3b3JkIjoicGxheWxpc3QiLCJkZXNjcmlwdGlvbiI6Ikxpc3RhIGRlIG36c2ljYXMgc2VsZWNpb25hZGFzIHBhcmEgdW1hIG9jYXNp428gb3UgdGVtYSBlc3BlY+1maWNvIn0seyJ3b3JkIjoiZXN0cm9mZSIsImRlc2NyaXB0aW9uIjoiQ29uanVudG8gZGUgdmVyc29zIHF1ZSBmb3JtYW0gdW1hIHVuaWRhZGUgbmEgZXN0cnV0dXJhIGRlIHVtYSBjYW7n428ifSx7IndvcmQiOiJyZWZy428iLCJkZXNjcmlwdGlvbiI6IlBhcnRlIGRhIG36c2ljYSBxdWUgc2UgcmVwZXRlLCBnZXJhbG1lbnRlIGEgbWFpcyBtZW1vcuF2ZWwifV0="

// const wordList = [
//   // Palavras originais revisadas (50)
//   { word: "abissal", description: "Relativo a grandes profundidades, especialmente oceânicas" },
//   { word: "acalanto", description: "Canção para embalar bebês; ato de acalentar" },
//   { word: "altivez", description: "Qualidade de quem é altivo, orgulhoso de maneira nobre" },
//   { word: "alusivo", description: "Que faz alusão, que se refere indiretamente a algo" },
//   { word: "apogeu", description: "Ponto mais alto de desenvolvimento ou sucesso" },
//   { word: "ardiloso", description: "Astuto, esperto, que age com dissimulação" },
//   { word: "ascensão", description: "Ato de subir ou elevar-se; progresso importante" },
//   { word: "assombro", description: "Espanto, admiração extrema; pode significar também fantasma" },
//   { word: "astúcia", description: "Habilidade para resolver situações com inteligência prática" },
//   { word: "baluarte", description: "Estrutura defensiva; figuradamente, proteção sólida" },
//   { word: "boêmio", description: "Que leva vida despreocupada, especialmente artística" },
//   { word: "bucólico", description: "Relativo à vida campestre idealizada, pastoral" },
//   { word: "candente", description: "Brilhante, ardente; assunto muito atual e importante" },
//   { word: "cauterizar", description: "Queimar tecido para fins médicos; figuradamente, marcar profundamente" },
//   { word: "celeuma", description: "Barulho, confusão; debate acalorado" },
//   { word: "cinzel", description: "Ferramenta para esculpir; figuradamente, trabalhar com precisão" },
//   { word: "colosso", description: "Estátua gigantesca; pessoa ou coisa de grande importância" },
//   { word: "contundente", description: "Que produz forte impacto, seja físico ou argumentativo" },
//   { word: "convés", description: "Piso superior de navio; palco de grandes eventos náuticos" },
//   { word: "corolário", description: "Conclusão lógica que decorre naturalmente de algo" },
//   { word: "decrépito", description: "Muito velho e enfraquecido; em avançado estado de deterioração" },
//   { word: "desígnio", description: "Plano ou propósito secreto; intenção oculta" },
//   { word: "destemido", description: "Que não tem medo, corajoso, intrépido" },
//   { word: "devaneio", description: "Pensamento distraído; sonho acordado" },
//   { word: "efêmero", description: "De curta duração, passageiro" },
//   { word: "emaranhado", description: "Em estado confuso; situação complexa e difícil" },
//   { word: "epítome", description: "Representação perfeita ou resumo essencial de algo" },
//   { word: "equívoco", description: "Maldade, erro de interpretação; situação ambígua" },
//   { word: "escárnio", description: "Zombaria ofensiva, deboche maldoso" },
//   { word: "esdrúxulo", description: "Estranho, excêntrico, fora do comum" },
//   { word: "estigma", description: "Marca de vergonha; cicatriz física ou emocional" },
//   { word: "estupefato", description: "Atordoado, extremamente surpreso" },
//   { word: "exortação", description: "Discurso para encorajar ou advertir veementemente" },
//   { word: "exuberante", description: "Cheio de vida, energia e abundância" },
//   { word: "fidedigno", description: "Confiável, digno de fé, verídico" },
//   { word: "flibusteiro", description: "Pirata do Caribe; pessoa aventureira e audaciosa" },
//   { word: "fulgurante", description: "Que brilha intensamente; rápido e impressionante" },
//   { word: "grandiloquente", description: "Que fala de modo pomposo ou exagerado" },
//   { word: "hégira", description: "Fuga de Maomé marcando o início do calendário islâmico" },
//   { word: "hermético", description: "Completamente fechado; difícil de entender" },
//   { word: "idílico", description: "Perfeitamente sereno e pacífico, como um idílio" },
//   { word: "impávido", description: "Que não demonstra medo, corajoso" },
//   { word: "inexorável", description: "Implacável, que não cede a pedidos" },
//   { word: "insólito", description: "Incomum, estranho, fora do ordinário" },
//   { word: "intrépido", description: "Audacioso, corajoso, destemido" },
//   { word: "jubiloso", description: "Cheio de júbilo, extremamente alegre" },
//   { word: "lúdico", description: "Relativo ao jogo; atividade prazerosa e recreativa" },
//   { word: "magnânimo", description: "Generoso, que perdoa ofensas com nobreza" },
//   { word: "mellifluo", description: "Doce como mel; voz ou música suave e agradável" },

//   // Países (30)
//   { word: "brasil", description: "Maior país da América do Sul, conhecido pelo Carnaval e futebol" },
//   { word: "canadá", description: "País norte-americano com vastas florestas e invernos rigorosos" },
//   { word: "japão", description: "Nação insular asiática conhecida por tecnologia e tradições milenares" },
//   { word: "itália", description: "País europeu com formato de bota, berço do Império Romano" },
//   { word: "méxico", description: "País da América do Norte com rica herança asteca e maia" },
//   { word: "argentina", description: "País sul-americano famoso pelo tango e excelente carne" },
//   { word: "alemanha", description: "País europeu líder em indústria e conhecido pela Oktoberfest" },
//   { word: "austrália", description: "Continente-ilha no hemisfério sul com fauna única como cangurus" },
//   { word: "egito", description: "País africano com pirâmides e história faraônica milenar" },
//   { word: "índia", description: "País asiático populoso com diversidade cultural e espiritual" },
//   { word: "rússia", description: "Maior país do mundo em extensão territorial" },
//   { word: "frança", description: "País europeu famoso pela Torre Eiffel e gastronomia refinada" },
//   { word: "espanha", description: "País ibérico conhecido pelo flamenco e arquitetura de Gaudí" },
//   { word: "china", description: "País mais populoso do mundo com grande crescimento econômico" },
//   { word: "holanda", description: "País europeu baixo conhecido por moinhos de vento e tulipas" },
//   { word: "suiça", description: "País alpino europeu famoso por relógios e chocolates" },
//   { word: "suecia", description: "País nórdico conhecido pelo Prêmio Nobel e design moderno" },
//   { word: "noruega", description: "País escandinavo com fiordes espetaculares e altíssimo IDH" },
//   { word: "grecia", description: "Berço da democracia e filosofia ocidental na Antiguidade" },
//   { word: "turquia", description: "País euroasiático com rica história otomana e bizantina" },
//   { word: "portugal", description: "País ibérico que colonizou o Brasil no século XVI" },
//   { word: "cuba", description: "Maior ilha do Caribe, conhecida por charutos e revolução" },
//   { word: "colombia", description: "País sul-americano com café de qualidade e cultura vibrante" },
//   { word: "peru", description: "País andino com sítio arqueológico de Machu Picchu" },
//   { word: "venezuela", description: "País sul-americano com as maiores reservas de petróleo" },
//   { word: "chile", description: "País longo e estreito entre Andes e Pacífico na América do Sul" },
//   { word: "bolivia", description: "País andino sem litoral com grande população indígena" },
//   { word: "paraguai", description: "País sul-americano conhecido por Ciudad del Este e futebol" },
//   { word: "uruguai", description: "Pequeno país sul-americano com altos índices de desenvolvimento" },
//   { word: "equador", description: "País cortado pela linha do Equador com biodiversidade única" },

//   // Pessoas famosas (30)
//   { word: "einstein", description: "Físico alemão criador da teoria da relatividade" },
//   { word: "darwin", description: "Naturalista inglês que formulou a teoria da evolução" },
//   { word: "mozart", description: "Compositor austríaco prodígio do período clássico" },
//   { word: "beethoven", description: "Gênio musical alemão que compôs mesmo surdo" },
//   { word: "picasso", description: "Artista espanhol pioneiro do cubismo na pintura" },
//   { word: "vangogh", description: "Pintor holandês pós-impressionista de 'Noite Estrelada'" },
//   { word: "shakespeare", description: "Maior dramaturgo inglês, autor de 'Hamlet' e 'Romeu e Julieta'" },
//   { word: "pelé", description: "Considerado por muitos o maior jogador de futebol de todos os tempos" },
//   { word: "marilyn", description: "Ícone hollywoodiano dos anos 50, símbolo sexual eterno" },
//   { word: "madonna", description: "Rainha do pop que revolucionou a música nos anos 80 e 90" },
//   { word: "elvis", description: "Rei do rock, ícone cultural dos anos 50 e 60" },
//   { word: "freddie", description: "Vocalista lendário da banda Queen, autor de 'Bohemian Rhapsody'" },
//   { word: "jobs", description: "Visionário co-fundador da Apple e pioneiro da computação pessoal" },
//   { word: "gandhi", description: "Líder pacifista que libertou a Índia do colonialismo britânico" },
//   { word: "lutherking", description: "Líder dos direitos civis nos EUA com discurso 'I Have a Dream'" },
//   { word: "mandela", description: "Símbolo global de luta contra o apartheid na África do Sul" },
//   { word: "disney", description: "Pioneiro da animação e criador do império do entretenimento" },
//   { word: "tolkien", description: "Escritor britânico criador do universo de 'O Senhor dos Anéis'" },
//   { word: "rowling", description: "Autora da série Harry Potter que revolucionou a literatura juvenil" },
//   { word: "nietzsche", description: "Filósofo alemão que declarou 'Deus está morto'" },
//   { word: "mariecurie", description: "Cientista pioneira no estudo da radioatividade, Nobel em Física e Química" },
//   { word: "tesla", description: "Inventor visionário de sistemas elétricos de corrente alternada" },
//   { word: "edison", description: "Inventor prolífico com mais de 1.000 patentes, incluindo a lâmpada" },
//   { word: "dawnero", description: "Gênio renascentista italiano autor da Mona Lisa e inventor visionário" },
//   { word: "freud", description: "Pai da psicanálise que revolucionou o estudo da mente humana" },
//   { word: "chaplin", description: "Cineasta britânico criador do personagem Carlitos no cinema mudo" },
//   { word: "kubrick", description: "Diretor de cinema perfeccionista de '2001' e 'Laranja Mecânica'" },
//   { word: "bowie", description: "Artista musical camaleônico que reinventou seu estilo diversas vezes" },

//   // Lugares famosos (30)
//   { word: "paris", description: "Cidade Luz, capital da França com Torre Eiffel e Louvre" },
//   { word: "roma", description: "Cidade Eterna, capital da Itália com Coliseu e Fontana di Trevi" },
//   { word: "novaiorque", description: "Maior cidade dos EUA com Estátua da Liberdade e Times Square" },
//   { word: "londres", description: "Capital do Reino Unido com Big Ben e Palácio de Buckingham" },
//   { word: "toquio", description: "Capital do Japão, metrópole futurista com tradições antigas" },
//   { word: "sidney", description: "Maior cidade da Austrália com icônico Opera House" },
//   { word: "machupicchu", description: "Cidade perdida dos Incas nos Andes peruanos" },
//   { word: "grandecanion", description: "Desfiladeiro imenso esculpido pelo Rio Colorado nos EUA" },
//   { word: "piramides", description: "Estruturas monumentais do Antigo Egito como tumbas faraônicas" },
//   { word: "petra", description: "Cidade rosa esculpida em rocha na Jordânia, patrimônio mundial" },
//   { word: "murdochina", description: "Grande muralha construída para proteger a China antiga" },
//   { word: "alpes", description: "Cadeia montanhosa europeia com picos cobertos de neve" },
//   { word: "amazonia", description: "Maior floresta tropical do mundo, pulmão do planeta" },
//   { word: "sahara", description: "Maior deserto quente do mundo cobrindo o norte da África" },
//   { word: "niagara", description: "Famosas cataratas entre EUA e Canadá" },
//   { word: "everest", description: "Pico mais alto do mundo na cordilheira do Himalaia" },
//   { word: "disney", description: "Parques temáticos famosos criados por Walt Disney" },
//   { word: "hollywood", description: "Distrito de Los Angeles sede da indústria cinematográfica americana" },
//   { word: "vegas", description: "Cidade do jogo e entretenimento no deserto de Nevada" },
//   { word: "dubai", description: "Cidade dos Emirados Árabes com arranha-céus futuristas" },
//   { word: "venezia", description: "Cidade italiana construída sobre canais, famosa pelos passeios de gôndola" },
//   { word: "barcelona", description: "Cidade espanhola com arquitetura modernista de Gaudí" },
//   { word: "kyoto", description: "Antiga capital do Japão com templos tradicionais e jardins zen" },
//   { word: "angkor", description: "Complexo de templos no Camboja, maior monumento religioso do mundo" },
//   { word: "maldivas", description: "Paraíso tropical no Oceano Índico com águas cristalinas" },
//   { word: "fiordes", description: "Enseadas marinhas alongadas entre montanhas, típicas da Noruega" },
//   { word: "capadocia", description: "Região da Turquia com formações rochosas únicas e cidades subterrâneas" },
//   { word: "santorini", description: "Ilha grega com arquitetura branca e azul sobre falésias" },
//   { word: "ilhapascoa", description: "Ilha chilena famosa por suas misteriosas estátuas moai" },

//   // Traços de personalidade (30)
//   { word: "carismático", description: "Que atrai e cativa as pessoas naturalmente" },
//   { word: "perspicaz", description: "Que percebe e compreende coisas rapidamente" },
//   { word: "resiliente", description: "Capaz de se recuperar de adversidades" },
//   { word: "empático", description: "Que se coloca no lugar do outro, compreendendo sentimentos alheios" },
//   { word: "altruísta", description: "Que pratica o altruísmo, colocando os outros antes de si" },
//   { word: "metódico", description: "Que age com método, de forma organizada e sistemática" },
//   { word: "criativo", description: "Que tem capacidade de criar, inventar, inovar" },
//   { word: "extrovertido", description: "Sociável, que se volta mais para o exterior que para si mesmo" },
//   { word: "magnânimo", description: "Generoso, que perdoa ofensas com nobreza de espírito" },
//   { word: "perseverante", description: "Que persiste em seus objetivos apesar das dificuldades" },
//   { word: "sincero", description: "Que fala e age com verdade, sem fingimento" },
//   { word: "ousado", description: "Que tem coragem para enfrentar riscos e desafios" },
//   { word: "prudente", description: "Cauteloso, que age com moderação e precaução" },
//   { word: "sábio", description: "Que tem sabedoria, conhecimento profundo e bom julgamento" },
//   { word: "humilde", description: "Que não tem orgulho excessivo, reconhece suas limitações" },
//   { word: "ambicioso", description: "Que tem forte desejo de alcançar objetivos elevados" },
//   { word: "idealista", description: "Que segue ideais, muitas vezes com certo desprezo pelo prático" },
//   { word: "cético", description: "Que duvida sistematicamente, exigindo provas para crer" },
//   { word: "otimista", description: "Que tende a ver o lado positivo das coisas" },
//   { word: "pessimista", description: "Que tende a ver o lado negativo das coisas" },
//   { word: "paciente", description: "Que sabe esperar e suportar adversidades sem irritação" },
//   { word: "impaciente", description: "Que não tolera demoras ou obstáculos" },
//   { word: "sensível", description: "Que sente com facilidade, emociona-se facilmente" },
//   { word: "racional", description: "Que age baseado na razão mais que nas emoções" },
//   { word: "espontâneo", description: "Que age naturalmente, sem planejamento ou artificialidade" },
//   { word: "calculista", description: "Que planeja cuidadosamente suas ações, muitas vezes de forma fria" },
//   { word: "temperamental", description: "De humor variável, que muda de atitude facilmente" },
//   { word: "sedutor", description: "Que atrai e encanta, especialmente no campo amoroso" },
//   { word: "disciplinado", description: "Que segue regras e métodos com rigor e ordem" },

//   // Música (30)
//   { word: "partitura", description: "Representação gráfica da música com notas e símbolos" },
//   { word: "melodia", description: "Sucessão de sons musicais que formam uma linha musical reconhecível" },
//   { word: "harmonia", description: "Combinação simultânea de notas musicais que soam agradavelmente" },
//   { word: "ritmo", description: "Organização temporal dos sons musicais, padrão de batidas" },
//   { word: "acorde", description: "Conjunto de três ou mais notas tocadas simultaneamente" },
//   { word: "sopro", description: "Instrumentos musicais tocados com ar como flautas e trompetes" },
//   { word: "percussão", description: "Instrumentos tocados por batida, como tambores e pratos" },
//   { word: "sinfonia", description: "Composição musical extensa para orquestra, geralmente em quatro movimentos" },
//   { word: "sonata", description: "Composição para um ou poucos instrumentos, geralmente em três ou quatro movimentos" },
//   { word: "concerto", description: "Composição musical que destaca um solista acompanhado por orquestra" },
//   { word: "ópera", description: "Drama musical encenado com cantores e orquestra" },
//   { word: "coral", description: "Música composta para coro, muitas vezes com temas religiosos" },
//   { word: "jazz", description: "Gênero musical originário dos EUA com improvisação e ritmos complexos" },
//   { word: "blues", description: "Gênero musical de origem afro-americana com estrutura de doze compassos" },
//   { word: "rock", description: "Gênero musical popular surgido nos anos 50 com guitarra elétrica" },
//   { word: "samba", description: "Gênero musical brasileiro com raízes africanas, símbolo do Carnaval" },
//   { word: "bossa", description: "Estilo musical brasileiro que mistura samba e jazz, popularizado nos anos 60" },
//   { word: "funk", description: "Gênero musical com batida forte e ênfase no groove" },
//   { word: "reggae", description: "Gênero musical jamaicano com batida característica e mensagens sociais" },
//   { word: "hiphop", description: "Movimento cultural que inclui rap, DJing, breakdance e graffiti" },
//   { word: "sertanejo", description: "Gênero musical brasileiro com raízes caipiras, muito popular no interior" },
//   { word: "forró", description: "Gênero musical e dança típica do Nordeste brasileiro" },
//   { word: "pagode", description: "Estilo musical brasileiro derivado do samba, com instrumentos como tantã e banjo" },
//   { word: "mpb", description: "Música Popular Brasileira, movimento que mistura tradição e inovação" },
//   { word: "trovador", description: "Compositor e cantor medieval; modernamente, cantor de música regional" },
//   { word: "crooner", description: "Cantor que interpreta canções românticas com estilo suave" },
//   { word: "cover", description: "Versão de uma música originalmente gravada por outro artista" },
//   { word: "playlist", description: "Lista de músicas selecionadas para uma ocasião ou tema específico" },
//   { word: "estrofe", description: "Conjunto de versos que formam uma unidade na estrutura de uma canção" },
//   { word: "refrão", description: "Parte da música que se repete, geralmente a mais memorável" }
// ];

  // Preload sounds
  Object.values(sounds).forEach(sound => {
    sound.load();
    sound.volume = 0.3;
  });
  
  // console.log(btoa(JSON.stringify(wordList)));

  wordList = JSON.parse(atob(wordListB64))

  // Pixel fire effect
  function initFireEffect() {
    const canvas = fireCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Fire parameters
    const fireWidth = 100;
    const fireHeight = 100;
    const pixelSize = Math.max(5, Math.floor(canvas.width / fireWidth));
    
    // Create fire buffer
    const firePixels = new Array(fireWidth * fireHeight).fill(0);
    
    function updateFire() {
      // Move fire upwards
      for (let x = 0; x < fireWidth; x++) {
        for (let y = 1; y < fireHeight; y++) {
          const index = y * fireWidth + x;
          const newY = Math.max(0, y - Math.floor(Math.random() * 3));
          const newIndex = newY * fireWidth + x;
          firePixels[newIndex] = Math.max(0, firePixels[index] - Math.random() * 0.2);
        }
      }
      
      // Generate new fire at bottom
      for (let x = 0; x < fireWidth; x++) {
        const index = (fireHeight - 1) * fireWidth + x;
        firePixels[index] = Math.random() > 0.3 ? 1 : 0;
      }
      
      // Spread fire sideways
      for (let x = 1; x < fireWidth - 1; x++) {
        for (let y = 0; y < fireHeight; y++) {
          const index = y * fireWidth + x;
          if (firePixels[index] > 0.1) {
            const spread = Math.random() * 0.2;
            firePixels[index - 1] = Math.min(1, firePixels[index - 1] + spread);
            firePixels[index + 1] = Math.min(1, firePixels[index + 1] + spread);
          }
        }
      }
    }

     function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
    
    function renderFire() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let x = 0; x < fireWidth; x++) {
        for (let y = 0; y < fireHeight; y++) {
          const index = y * fireWidth + x;
          const intensity = firePixels[index];
          
          if (intensity > 0) {
            let r, g, b;
            if (intensity > 0.8) {
              r = 255;
              g = 255;
              b = 255 * (intensity - 0.8) * 5;
            } else if (intensity > 0.6) {
              r = 255;
              g = 255 * (intensity - 0.6) * 5;
              b = 0;
            } else if (intensity > 0.3) {
              r = 255;
              g = 165 * (intensity - 0.3) * 3.33;
              b = 0;
            } else {
              r = 255 * intensity * 3.33;
              g = 0;
              b = 0;
            }
            
            ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${intensity})`;
            ctx.fillRect(
              x * pixelSize, 
              canvas.height - (y * pixelSize), 
              pixelSize, 
              pixelSize
            );
          }
        }
      }
    }
    
    function animate() {
      updateFire();
      renderFire();
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
     resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  }

  // Create fire sparks
  function createFireSparks() {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const spark = document.createElement("div");
        spark.classList.add("spark");
        
        const left = Math.random() * 100;
        spark.style.left = `${left}vw`;
        spark.style.bottom = "0";
        
        const hue = Math.random() * 20 + 10;
        spark.style.background = `linear-gradient(to top, hsl(${hue}, 100%, 50%), transparent`;
        
        const width = Math.random() * 4 + 2;
        spark.style.width = `${width}px`;
        spark.style.height = `${Math.random() * 30 + 15}px`;
        
        const duration = Math.random() * 5 + 3;
        spark.style.animationDuration = `${duration}s`;
        
        fireBackground.appendChild(spark);
        
        setTimeout(() => {
          spark.remove();
        }, duration * 1000);
      }, i * 100);
    }
  }

  // Create fire animation loop
  function startFireAnimation() {
    createFireSparks();
    setTimeout(startFireAnimation, 800);
    
    if (soundEnabled) {
      sounds.fire.loop = true;
      sounds.fire.play().catch(e => console.log("Fire sound error:", e));
    } else {
      sounds.fire.pause();
    }
  }

  function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const selected = wordList[randomIndex];
    return {
      word: selected.word.toLowerCase(),
      hint: `DEFINIÇÃO: ${selected.description}`
    };
  }

  function initGame() {
    const { word, hint } = getRandomWord();
    selectedWord = normalizeWord(word);
    displayedWord = Array(selectedWord.length).fill("_");
    wrongGuesses = 0;

    wordDisplay.textContent = displayedWord.join(" ");
    wrongDisplay.textContent = wrongGuesses;
    message.textContent = "";
    message.className = "message";
    restartBtn.style.display = "none";
    
    // Formata a dica para melhor visualização
    const formattedHint = hint
      .replace(/\n/g, '<br>')
      .replace(/DEFINIÇÃO:/g, '<strong>DEFINIÇÃO:</strong>')
    
    hintText.innerHTML = formattedHint;
    
    // Reset hangman figure
    hangmanFigure.className = "hangman-figure";
    document.querySelector(".mouth").className = "mouth";
    document.querySelector(".blood").className = "blood";
    document.querySelector(".blood-stream").style.height = "0";
    document.querySelector(".blood-pool").style.height = "0";
    document.querySelectorAll(".blood-drip").forEach(drip => {
      drip.classList.remove("visible");
    });

    // Reset hearts
    hearts.forEach(heart => {
      heart.style.opacity = "1";
    });

    // Reset keyboard
    keyboard.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i).toLowerCase();
      const btn = document.createElement("button");
      btn.textContent = letter;
      btn.addEventListener("click", () => handleGuess(letter, btn));
      keyboard.appendChild(btn);
    }

    // Start fire animation
    initFireEffect();
    startFireAnimation();
  }

  function playSound(soundName) {
    if (!soundEnabled) return;
    
    const sound = sounds[soundName];
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play failed:", e));
  }

  function handleGuess(letter, btn) {
    playSound("click");
    btn.disabled = true;

    if (selectedWord.includes(letter)) {
      playSound("correct");
      btn.classList.add("correct");
      
      const rect = btn.getBoundingClientRect();
      createParticles(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        "#00ff7f",
        20
      );

      for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === letter) {
          displayedWord[i] = letter;
        }
      }
      wordDisplay.textContent = displayedWord.join(" ");
    } else {
      playSound("wrong");
      wrongGuesses++;
      wrongDisplay.textContent = wrongGuesses;
      btn.classList.add("wrong");
      
      hangmanFigure.classList.add(`show-${wrongGuesses}`);
      
      if (wrongGuesses <= hearts.length) {
        hearts[hearts.length - wrongGuesses].style.opacity = "0.3";
        const heartRect = hearts[hearts.length - wrongGuesses].getBoundingClientRect();
        createExplosion(
          heartRect.left + heartRect.width / 2,
          heartRect.top + heartRect.height / 2,
          0.5
        );
      }
      
      hangmanFigure.style.animation = "shake 0.5s";
      setTimeout(() => {
        hangmanFigure.style.animation = "";
      }, 500);
      
      const rect = btn.getBoundingClientRect();
      createExplosion(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        0.7
      );
      
      if (wrongGuesses >= 3) {
        const headRect = document.querySelector(".head").getBoundingClientRect();
        createBloodSplatter(
          headRect.left + headRect.width / 2,
          headRect.top + headRect.height / 2,
          8
        );
      }
    }

    checkGameStatus();
  }

  function checkGameStatus() {
    if (!displayedWord.includes("_")) {
      playSound("win");
      sounds.fire.pause();
      message.textContent = "🎉 PARABÉNS! VOCÊ VENCEU! 🎉";
      message.classList.add("show", "success");

      endGame();
      
      hangmanFigure.style.animation = "celebrate 2s";
      setTimeout(() => {
        hangmanFigure.style.animation = "";
      }, 2000);

      const winEffects = () => {
        const fireworks = document.createElement('div');
        fireworks.style.position = 'fixed';
        fireworks.style.top = '0';
        fireworks.style.left = '0';
        fireworks.style.width = '100%';
        fireworks.style.height = '100%';
        fireworks.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)';
        fireworks.style.zIndex = '100';
        fireworks.style.animation = 'fadeOut 2s forwards';
        document.body.appendChild(fireworks);
        
        const style = document.createElement('style');
        style.textContent = `
          @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.5); }
          }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
          fireworks.remove();
          style.remove();
        }, 2000);
      };
      
      winEffects();
      
    } else if (wrongGuesses >= maxGuesses) {
      playSound("lose");
      sounds.fire.pause();

      message.textContent = `☠️ VOCÊ PERDEU! A PALAVRA ERA "${selectedWord.toUpperCase()}". ☠️`;
      message.classList.add("show", "error");
      endGame();
      
      hangmanFigure.classList.add("dead-eyes", "bleeding");
      document.querySelector(".mouth").classList.add("dead");
      document.querySelector(".blood").classList.add("visible");
      document.querySelector(".blood-stream").style.height = "140px";
      document.querySelector(".blood-pool").style.height = "30px";
      document.querySelectorAll(".blood-drip").forEach(drip => {
        drip.classList.add("visible");
      });
      
      hangmanFigure.style.animation = "dead 1s";
      setTimeout(() => {
        hangmanFigure.style.animation = "";
      }, 1000);
      
      const headRect = document.querySelector(".head").getBoundingClientRect();
      for (let i = 0; i < 50; i++) {
        setTimeout(() => {
          createBloodSplatter(
            headRect.left + headRect.width / 2,
            headRect.top + headRect.height / 2,
            5
          );
        }, i * 50);
      }
      
      setTimeout(() => {
        createExplosion(
          headRect.left + headRect.width / 2,
          headRect.top + headRect.height / 2,
          1.5
        );
      }, 300);
    }
  }

  function endGame() {
    const buttons = keyboard.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = true);
    restartBtn.style.display = "flex";
    
    // Para o som do fogo
    sounds.fire.pause();
  }

  function normalizeWord(word) {
    return word
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");
  }

  function generateSmartHint(word) {
    const wordLength = word.length;
    let hint = `PALAVRA COM ${wordLength} LETRAS: `;
    
    if (word.endsWith('ção') || word.endsWith('são')) {
      hint += "Provavelmente um substantivo que indica ação ou processo. ";
    } else if (word.endsWith('mente')) {
      hint += "Provavelmente um advérbio de modo. ";
    } else if (word.endsWith('ar') || word.endsWith('er') || word.endsWith('ir')) {
      hint += "Provavelmente um verbo no infinitivo. ";
    } else if (wordLength <= 4) {
      hint += "Palavra curta, pode ser artigo, preposição ou substantivo comum. ";
    } else if (wordLength <= 6) {
      hint += "Palavra de tamanho médio, possivelmente um substantivo ou verbo. ";
    } else {
      hint += "Palavra longa, frequentemente um substantivo ou adjetivo. ";
    }
    
    if (word.includes('rr')) hint += "Contém o dígrafo 'RR' (som forte). ";
    if (word.includes('ss')) hint += "Contém o dígrafo 'SS' (som sibilante). ";
    if (word.includes('nh')) hint += "Contém o dígrafo 'NH' (som nasal). ";
    
    if (word.startsWith('a')) hint += "Começa com a vogal 'A'. ";
    if (word.startsWith('z')) hint += "Começa com a consoante 'Z' (som de 'zê'). ";
    
    return hint;
  }

  function createParticles(x, y, color, count = 30) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      particle.style.backgroundColor = color;
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 8 + 3;
      const xVelocity = Math.cos(angle) * velocity;
      const yVelocity = Math.sin(angle) * velocity;
      
      particlesContainer.appendChild(particle);
      
      let opacity = 1;
      const fadeInterval = setInterval(() => {
        opacity -= 0.05;
        particle.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          particle.remove();
        }
      }, 50);
      
      let posX = x;
      let posY = y;
      const moveInterval = setInterval(() => {
        posX += xVelocity;
        posY += yVelocity + 0.8;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
      }, 30);
      
      setTimeout(() => {
        clearInterval(moveInterval);
      }, 1000);
    }
  }

  function createBloodSplatter(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const bloodDrop = document.createElement("div");
      bloodDrop.classList.add("particle");
      bloodDrop.style.backgroundColor = `hsl(${Math.random() * 10 + 350}, 80%, 50%)`;
      bloodDrop.style.width = `${Math.random() * 8 + 3}px`;
      bloodDrop.style.height = `${Math.random() * 8 + 3}px`;
      bloodDrop.style.borderRadius = "50%";
      bloodDrop.style.left = `${x}px`;
      bloodDrop.style.top = `${y}px`;
      bloodDrop.style.boxShadow = `0 0 5px ${bloodDrop.style.backgroundColor}`;
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 5 + 2;
      const xVelocity = Math.cos(angle) * velocity;
      const yVelocity = Math.sin(angle) * velocity;
      
      document.body.appendChild(bloodDrop);
      
      let opacity = 1;
      const fadeInterval = setInterval(() => {
        opacity -= 0.03;
        bloodDrop.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          bloodDrop.remove();
        }
      }, 50);
      
      let posX = x;
      let posY = y;
      const moveInterval = setInterval(() => {
        posX += xVelocity;
        posY += yVelocity + 0.5;
        bloodDrop.style.left = `${posX}px`;
        bloodDrop.style.top = `${posY}px`;
      }, 30);
      
      setTimeout(() => {
        clearInterval(moveInterval);
      }, 2000);
    }
  }

  function createExplosion(x, y, size = 1) {
    const colors = ['#ff2a00', '#ff8c00', '#ffcc00', '#ffffff'];
    const container = document.querySelector('.game-container');

    for (let i = 0; i < 50 * size; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = `${Math.random() * 8 * size + 4}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.borderRadius = "50%";
      particle.style.boxShadow = `0 0 ${5 * size}px ${particle.style.backgroundColor}`;
      
      container.appendChild(particle);
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 10 * size + 5;
      const xVelocity = Math.cos(angle) * velocity;
      const yVelocity = Math.sin(angle) * velocity;
      
      document.body.appendChild(particle);
      
      let opacity = 1;
      const fadeInterval = setInterval(() => {
        opacity -= 0.02;
        particle.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          particle.remove();
        }
      }, 50);
      
      let posX = x;
      let posY = y;
      const moveInterval = setInterval(() => {
        posX += xVelocity;
        posY += yVelocity + 0.5;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
      }, 30);
      
      setTimeout(() => {
        clearInterval(moveInterval);
      }, 2000);
    }
  }

  restartBtn.addEventListener("click", () => {
    playSound("click");
    initGame();
    sounds.win.pause();
    sounds.lose.pause();
  });

  document.addEventListener("keydown", (e) => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key.toLowerCase();
      const button = Array.from(keyboard.querySelectorAll("button")).find(
        btn => btn.textContent === letter && !btn.disabled
      );
      if (button) button.click();
    }
  });

  // Adjust word display for small screens
  function adjustWordDisplay() {
    const wordLength = wordDisplay.textContent.replace(/\s/g, '').length;
    const containerWidth = document.querySelector('.word-container').offsetWidth;
    
    if (window.innerWidth <= 480) {
      if (wordLength > 10) {
        wordDisplay.style.fontSize = '1.2rem';
        wordDisplay.style.letterSpacing = '5px';
      } else {
        wordDisplay.style.fontSize = '1.5rem';
        wordDisplay.style.letterSpacing = '8px';
      }
    } else if (window.innerWidth <= 768) {
      if (wordLength > 15) {
        wordDisplay.style.fontSize = '1.5rem';
        wordDisplay.style.letterSpacing = '8px';
      } else {
        wordDisplay.style.fontSize = '2rem';
        wordDisplay.style.letterSpacing = '10px';
      }
    } else {
      wordDisplay.style.fontSize = '2.5rem';
      wordDisplay.style.letterSpacing = '14px';
    }
  }

  window.addEventListener('resize', () => {
    const canvas = fireCanvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    adjustWordDisplay();
  });

  window.onload = () => {
    initGame();
    adjustWordDisplay();
  };
function checkWordLength() {
  const wordContainer = document.querySelector('.word-container');
  const wordDisplay = document.querySelector('.word-display');
  const isMobile = window.innerWidth <= 768;
  
  // Remove todas as classes de tamanho existentes
  wordContainer.classList.remove('scrollable');
  
  // Verifica se a palavra é longa demais para o container
  if (wordDisplay.scrollWidth > wordContainer.offsetWidth) {
    if (isMobile && selectedWord.length > 6) {
      wordContainer.classList.add('scrollable');
    } else if (!isMobile && selectedWord.length > 8) {
      wordContainer.classList.add('scrollable');
    }
  }
}
  window.addEventListener('resize', checkWordLength);