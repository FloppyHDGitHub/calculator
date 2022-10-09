special_characters = ["√", "%", "!", "^"];

// Vorabrechnung im unteren Teil
function appendOperation(operation) {
    document.getElementById("resultArea").innerHTML += operation;
    let container = document.getElementById("resultArea");
    let container1 = document.getElementById("lilresultArea");
    container1.innerHTML = calcBox(convertString(container.innerHTML));
}

// errechnen des ergebnis und eintragen in die obere Spalte
function calculateResult(container) {
    let result = calcBox(convertString(container.innerHTML));
    if (result !== undefined) {
        container.innerHTML = result;
        document.getElementById("lilresultArea").innerHTML = "";
    }
    return result;
}

// letztes Zeichen entfernen
function deleteLast() {
    let container = document.getElementById("resultArea");
    if (container.innerHTML.endsWith(" ")) {
        container.innerHTML = container.innerHTML.slice(0, -3);
    } else {
        container.innerHTML = container.innerHTML.slice(0, -1);
    }
}

// Alles entfernen
function deleteall() {
    document.getElementById("resultArea").innerHTML = "";
    document.getElementById("lilresultArea").innerHTML = "";
}


// Darkmode-toggle
function darkmode() {
    var element = document.body;
    element.classList.toggle("dark");
}
function promode() {
    var element = document.body;
    element.classList.toggle("pro");
}


//Mathe-Sektion

// String in array umwandeln
function convertString(string) { // ergebnis vereinfacht rechnung
    let string_array = string.split([]) // String zerlegen,
    let build_array = [] // leeres Array erstellen
    for (index = 0; index < string_array.length; index++) { // yay... for-loop
        let j = 0 // für while loop, um Länge der zahl zu definieren
        while ((Number.isInteger(Number.parseInt(string_array[index+j]))) || (string_array[index+j] == "\.")){
            // während der aktuell geteste eintrag entweder eine Zahl oder ein Punkt ist, die Länge des eintrages um 1 erhöhen
            j++
        }
        build_array.push((string_array.splice(index, (j==0?j+1:j)).join("")))
        // eintrag aus dem string splicen und ins array pushen (ersetzen würde eventuell fehler verursachen)
        index-- // Gehe zurück zum Start, ziehe keinen weiteren Wert ein
    } // string_array ist leer nach dem ganzen hier

    // vordefinierung der Sonderzeichen
    specials = ["(", ")", "!", "√", "ˆ", "%", "+", "-", "*", "/",] // alle "speziellen" Zeichen zur Nutzung im .map

    /* Erstelle nun neues array mit konvertierten Werten (zur einfachen verwendung von berechnungen),
    und gib dieses als Ergebnis der Funktion aus
    (eigentlich unnötig, sieht beim Debuggen aber besser aus) 😜 */
    return build_array.map(item=>{ // für jedes "item" im neuen array >
        if (specials.some(s=> item.includes(s))) { // wenn es ein Sonderzeichen enthält
            return item // nur das Sonderzeichen ausgeben
        }
        else if (["."].some(s=> item.includes(s))) { // ansonsten wenn es ein Punkt enthält
            return Number.parseFloat(item) // in ein Float umwandeln (Komma-zahl)
        }
        else {
            return Number.parseInt(item) // der klägliche rest sind nur Ganz-Zahlen
        }
        // könnte ich auch in ein ternary packen, aber das ist ein Horror im Debug
    })
}

// Mathematik zum errechnen des Faktorial
function fakultaet(n) {
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result = result * i;
    }
    return result;
}
// function root(x, z) {} // wird das noch benötigt?

// Berechnungs-"Box" (zum verkapseln von anfragen)
function calcBox(arg) {
    console.log(arg)
    for (i = 0; i < arg.length; i++) {
        // Faktorial
        if (arg[i] == "!") {
            var j = 1;
            while (Number.isInteger(Number.parseInt(arg[i - j]))) {
                j++;
            }
            j--;
            fakt_num = Number.parseInt(arg.splice(i - j, j).join(""));
            fakt = fakultaet(fakt_num);
            arg.splice(i - j, 1, fakt);
            i -= j + 1; // verringere i, mit der Anzahl der ausgetauschten werte
        } 
        else if (arg[i] == "√") {
            // Wurzeln (startet mit Klammer)
            let isFloat = n => Number(n) === n && n%1 !== 0;
            var j = (Number.isInteger(arg[i - 1]) || isFloat(arg[i - 1]))?1:0 // definiere länge VOR wurzel wenn ein wert gegeben ist
            var k = 1;
            k_ = 1; // Klammer-berechnung
            while (k_ != 0 && i + k < arg.length) {
                if (arg[i + k + 1] == "(") {
                    k_++;
                }
                if (arg[i + k + 1] == ")") {
                    k_--;
                }
                k++;
            }
            k--; // idk why, aber es brauch es
            n = j == 0 ? 0 : arg.splice(i - 1, 1);
            // definiere n nur, wenn eine nte Zahl definiert wurde und extrahiere den vorherigen eintrag

            let calc = arg.splice(i + 1 - j, k).join("");
            // extrahiere werte und wandel in neuen String um

            if (k_ > 0) {
                for (null; k_ != 0; k_--) {
                    calc += ")";
                }
            } // "virtuell" Klammer hinzufügen, solange noch welche fehlen

            x = special_characters.some((sc) => calc.includes(sc)) // erklärung unten
                ? calcBox(calc.split([]))
                : eval(calc) == undefined
                    ? NaN
                    : eval(calc);
            /* Größtes Problem war hier ...
                          Problembehandlung:
                              oben im Code definierte ich die verwendeten Sonderzeichen
                              ablauf-verfolgung von X:
                                  zunächst prüfe ich ob die sonderzeichen im calc-string enthalten sind,
                                  ? wenn dies der fall ist, dann werfe ich den string nochmal in die calcBox
                                  : ansonsten überprüfe ich, OB ein undefined enstehen würde
                                      ? ist dies der fall ist der Wert NaN
                                      : ansonsten eval den calc-string
                          */
            root = NaN; // predefine root, solange nicht gerechnet wird, ist es "Not a Number"
            if (j > 0 && x > 0) { // ist `x` & `j` vorhanden? dann 'n'te Wurzel ziehen
                root = Math.pow(x, 1 / n);
            } else if (x > 0) { // ansonsten Quadrat-wurzel
                root = Math.sqrt(x);
            }
            arg.splice(i-j, 1, root);
            i -= (j + 2); // verringere index i, mit der Anzahl der ausgetauschten werte
        } 
        else if (arg[i] == "ˆ") {
            arg.splice(i, 1, "**")
        }
    }
    return eval(arg.join(""));
}