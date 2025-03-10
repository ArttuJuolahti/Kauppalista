document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("kauppalista-form"); // Haetaan lomakeelementti
    const input = document.getElementById("tuote"); // Haetaan syötekenttä
    const lista = document.getElementById("lista"); // Haetaan lista, johon tuotteet lisätään
    const virheilmoitus = document.getElementById("virheilmoitus"); // Haetaan virheilmoituksen näyttöalue


    // Lataa kauppalista localStoragesta ja näyttää sen sivulla
    function lataaLista() {
        const tuotteet = JSON.parse(localStorage.getItem("kauppalista")) || []; // Haetaan lista tai alustetaan tyhjäksi
        lista.innerHTML = ""; // Tyhjennetään lista ensin
        tuotteet.forEach(tuote => lisaaListaan(tuote.nimi, tuote.ostettu)); // Lisätään jokainen tallennettu tuote listaan
    }


    // Lisää tuotteen näkyviin listaan
    function lisaaListaan(nimi, ostettu = false) {
        const li = document.createElement("li"); // Luodaan uusi listaelementti
        li.className = "list-group-item d-flex justify-content-between align-items-center"; // Lisätään Bootstrap-tyylit
        if (ostettu) li.classList.add("ostettu"); // Merkitään ostetuksi, jos se oli jo ostettu
        li.textContent = nimi; // Asetetaan tuotteen nimi näkyviin


        const buttonContainer = document.createElement("div"); // Luodaan painikkeiden säiliö
        buttonContainer.classList.add("button-container");


        const merkitseNappi = document.createElement("button"); // Luodaan oston merkintäpainike
        merkitseNappi.className = "btn btn-sm btn-outline-success";
        merkitseNappi.textContent = ostettu ? "✘" : "✔"; // Muutetaan nappi dynaamisesti tilan mukaan
        merkitseNappi.onclick = () => {
            merkitseOstetuksi(nimi); // Kutsutaan funktiota, joka muuttaa ostotilaa
            console.log(`Item marked as ${ostettu ? 'not purchased' : 'purchased'}: ${nimi}`);
        };

        const poistaNappi = document.createElement("button"); // Luodaan poistopainike
        poistaNappi.className = "btn btn-sm btn-outline-danger ml-2";
        poistaNappi.textContent = "Poista";
        poistaNappi.onclick = () => {
            poistaTuote(nimi); // Poistetaan tuote listalta ja localStoragesta
            console.log(`Item removed: ${nimi}`);
        };

        buttonContainer.appendChild(merkitseNappi); // Lisätään painikkeet säiliöön
        buttonContainer.appendChild(poistaNappi);
        li.appendChild(buttonContainer); // Lisätään painikkeiden säiliö listaelementtiin
        lista.appendChild(li); // Lisätään listaelementti näkyviin listaan
    }


    // Päivittää listan tiedot localStorageen
    function paivitaTallennus() {
        const tuotteet = [...lista.children].map(li => ({ // Käydään läpi listan elementit ja luodaan niistä JSON-muotoinen lista
            nimi: li.childNodes[0].textContent, // Haetaan tuotteen nimi
            ostettu: li.classList.contains("ostettu") // Tarkistetaan, onko tuote merkitty ostetuksi
        }));
        localStorage.setItem("kauppalista", JSON.stringify(tuotteet)); // Tallennetaan lista localStorageen
        console.log("List updated in localStorage");
    }


    // Poistaa tuotteen localStoragesta ja päivittää listan
    function poistaTuote(nimi) {
        const tuotteet = JSON.parse(localStorage.getItem("kauppalista")) || []; // Haetaan tuotteet localStoragesta
        const paivitetty = tuotteet.filter(t => t.nimi !== nimi); // Suodatetaan pois poistettava tuote
        localStorage.setItem("kauppalista", JSON.stringify(paivitetty)); // Tallennetaan päivitetty lista
        lataaLista(); // Päivitetään näkyvä lista
        console.log(`Item removed from localStorage: ${nimi}`);
    }


    // Muuttaa tuotteen tilan ostetuksi tai takaisin ostamattomaksi
    function merkitseOstetuksi(nimi) {
        const tuotteet = JSON.parse(localStorage.getItem("kauppalista")) || []; // Haetaan tuotteet
        const paivitetty = tuotteet.map(t => t.nimi === nimi ? { nimi: t.nimi, ostettu: !t.ostettu } : t); // Käännetään ostotila
        localStorage.setItem("kauppalista", JSON.stringify(paivitetty)); // Tallennetaan muutos
        lataaLista(); // Päivitetään näkyvä lista
        console.log(`Item marked as ${paivitetty.find(t => t.nimi === nimi).ostettu ? 'purchased' : 'not purchased'} in localStorage: ${nimi}`);
    }


    // Lomakkeen tapahtumankäsittelijä uuden tuotteen lisäämiseksi
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Estetään lomakkeen oletustoiminta (uudelleenlataus)
        const tuote = input.value.trim(); // Haetaan ja siistitään syötekentän arvo

        if (tuote.length < 3) { // Tarkistetaan, että nimi on tarpeeksi pitkä
            virheilmoitus.textContent = "Tuotenimen tulee olla vähintään 3 merkkiä pitkä!";
            input.classList.add("virhe"); // Lisätään virheluokka
            console.log("Error: Product name must be at least 3 characters long");
            return;
        }


        const tuotteet = JSON.parse(localStorage.getItem("kauppalista")) || []; // Haetaan tuotteet
        if (tuotteet.some(t => t.nimi === tuote)) { // Tarkistetaan, onko tuote jo listalla
            virheilmoitus.textContent = "Tuote on jo listalla!";
            input.classList.add("virhe");
            console.log("Error: Product is already in the list");
            return;
        }
        
        if (tuote.length > 100) { // Tarkistetaan, että nimi ei ole liian pitkä
            virheilmoitus.textContent = "Tuotenimen tulee olla enintään 100 merkkiä pitkä!";
            input.classList.add("virhe"); // Lisätään virheluokka
            console.log("Error: Product name must be at most 100 characters long");
            return;
        }


        virheilmoitus.textContent = ""; // Tyhjennetään virheilmoitus
        input.classList.remove("virhe"); // Poistetaan virheluokka
        lisaaListaan(tuote); // Lisätään tuote näkyviin listaan
        paivitaTallennus(); // Tallennetaan muutokset
        input.value = ""; // Tyhjennetään syötekenttä
        console.log(`Item added: ${tuote}`);
    });
    

    lataaLista(); // Lataa tallennetut tuotteet heti sivun latautuessa
});
