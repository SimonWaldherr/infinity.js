/* * * * * * * * * *
 *   disTime .js   *
 *  Version   0.2  *
 *  License:  MIT  *
 * Simon  Waldherr *
 * * * * * * * * * */

/*jslint browser: true, plusplus: true, white: true, indent: 2 */

var disTimeRepeater;

function disTime(timedifference, language, detailed) {
  "use strict";
  var elements, elementcount, smallest, i, timestamp, elementtime, distime, insert,
    words = {
      'en': ['', ' ago', ' and ', ' second ', ' seconds ', ' minute ', ' minutes ', ' hour ', ' hours ', ' day ', ' days ', ' week ', ' weeks ', ' month ', ' months ', ' year ', ' years '],
      'de': ['vor ', '', ' und ', ' Sekunde ', ' Sekunden ', ' Minute ', ' Minuten ', ' Stunde ', ' Stunden ', ' Tag ', ' Tage ', ' Woche ', ' Wochen ', ' Monat ', ' Monate ', ' Jahr ', ' Jahre '],
      'it': ['', ' fa', ' e ', ' secondo ', ' secondi ', ' minuto ', ' minuti ', ' ora ', ' ore ', ' giorno ', ' giorni ', ' settimana ', ' settimane ', ' mese ', ' mesi ', ' anno ', ' anni ']
    };

  timestamp = parseInt(Date.now() / 1000, 10) + timedifference;
  elements = document.getElementsByClassName('distime');
  elementcount = elements.length;
  smallest = timestamp;
  for (i = 0; i < elementcount; ++i) {
    elementtime = elements[i].getAttribute("data-time");
    distime = timestamp - elementtime;

    if ((typeof distime === 'number') && (parseInt(distime, 10) === distime)) {
      insert = words[language][0];

      if (distime > 31536000) {
        //years
        insert += parseInt(parseInt(distime, 10) / parseInt(31536000, 10), 10);
        if (parseInt(distime / 31536000 * 1.2, 10) === 1) {
          insert += words[language][15];
        } else {
          insert += words[language][16];
        }
      }

      if (((distime < 60 * 60 * 24 * 365) && (distime > 60 * 60 * 24 * 7 * 4)) || ((distime > 60 * 60 * 24 * 365) && detailed && (parseInt(distime % 31536000 / 2419200, 10) !== 0))) {
        //months
        insert += parseInt(distime % 31536000 / 2419200, 10);
        if (parseInt(distime % 31536000 / 2419200, 10) === 1) {
          insert += words[language][13];
        } else {
          insert += words[language][14];
        }

        if (((distime < 60 * 60 * 24 * 365) && detailed && (parseInt(distime % 2419200 / 86400, 10) !== 0))) {
          //days
          insert += parseInt(distime % 2419200 / 86400, 10);
          if (parseInt(distime % 2419200 / 86400, 10) === 1) {
            insert += words[language][9];
          } else {
            insert += words[language][10];
          }
        }
      }

      if (((distime < 60 * 60 * 24 * 7 * 4) && (distime > 60 * 60 * 24 * 7)) || ((distime < 10368000) && (distime > 2419199) && detailed && (parseInt(distime % 2592000 / 2419200, 10) !== 0))) {
        //weeks
        insert += parseInt(distime % 2419200 / 604800, 10);
        if (parseInt(distime % 2419200 / 604800, 10) === 1) {
          insert += words[language][11];
        } else {
          insert += words[language][12];
        }
      }

      if (((distime < 60 * 60 * 24 * 7) && (distime > 86399)) || ((distime < 2419200) && (distime > 604799) && detailed && (parseInt(distime % 604800 / 86400, 10) !== 0))) {
        //days
        insert += parseInt(distime % 604800 / 86400, 10);
        if (parseInt(distime % 604800 / 86400, 10) === 1) {
          insert += words[language][9];
        } else {
          insert += words[language][10];
        }
      }

      if (((distime < 86400) && (distime > 3599)) || ((distime < 604800) && (distime > 86399) && detailed && (parseInt(distime % 86400 / 3600, 10) !== 0))) {
        //hours
        insert += parseInt(distime % 86400 / 3600, 10);
        if (parseInt(distime % 86400 / 3600, 10) === 1) {
          insert += words[language][7];
        } else {
          insert += words[language][8];
        }
      }

      if (((distime < 3600) && (distime > 59)) || ((distime < 86400) && (distime > 3599) && detailed && (parseInt(distime % 3600 / 60, 10) !== 0))) {
        //minutes
        insert += parseInt(distime % 3600 / 60, 10);
        if (parseInt(distime % 3600 / 60, 10) === 1) {
          insert += words[language][5];
        } else {
          insert += words[language][6];
        }
      }

      if ((distime < 60) || ((distime < 3600) && (distime > 59) && detailed && (distime % 60 !== 0))) {
        //seconds
        insert += distime % 60;
        if (distime % 60 === 1) {
          insert += words[language][3];
        } else {
          insert += words[language][4];
        }
      }

      insert += words[language][1];
      elements[i].innerHTML = insert;

      if (distime < smallest) {
        smallest = distime;
      }
    }
  }

  window.clearTimeout(disTimeRepeater);
  if ((smallest < 61) || (detailed && smallest < 3601)) {
    disTimeRepeater = setTimeout(disTime, 1000, timedifference, language, detailed);
  } else if ((smallest < 3601) || (detailed && smallest < 86400)) {
    disTimeRepeater = setTimeout(disTime, 60000, timedifference, language, detailed);
  } else if ((smallest < 86400) || detailed) {
    disTimeRepeater = setTimeout(disTime, 3600001, timedifference, language, detailed);
  } else {
    disTimeRepeater = setTimeout(disTime, 86400001, timedifference, language, detailed);
  }
}
