## https://ribardej.github.io/kaj-semestral/
semestral work for the subject KAJ. Excel tools.

### Dokumentace:
##### Změny v implementaci oproti zadání:  
Namísto funkcionalit k vizualizaci souboru jsem se rozhodl přidat možnost vytvořit Excel soubor 'online'.  
Aplikace je tak více prakticky zaměřena.

#### Ovládání:  
Uživatel má k dispozici dvě různé funkcionality-upravit vlastní excel(.xls, .xlsx) soubor v sekci "Edit", nebo vytvořit nový v sekci "Create".  
Nahrání prázdného souboru není povoleno(objeví se alert).  
Vytvořenou/upravenou tabulku si uživatel může kdykoliv stáhnout kliknutím na tlačítko "Download as Excel file".  
Uživatel interaguje s aplikací pomocí úprav v interaktivní tabulce, může přidávat řádky i sloupce, samozřejmostí je úprava jednotlivých buněk. Úpravu buňky lze potvrdit kliknutím mimo danou buňku, nebo stisknutím klávesy enter.  
Pokud je tabulka příliž široká, objeví se horizontální scrollbar.  
V sekci "main" je připraven mechanismus drag&drop.  
Animace jsou u :hover efektu nad tlačítky pro rozšíření tabulky.  
Historie je funkční, avšak neupravuje URL stránky.  
Aplikace funguje i offline. Aktivně však stav nekontroluje, jelikož připojení k internetu stejně nepotřebuje k funkčnosti.  
Audio je u kliknutí na tlačítka "Edit"/"Create" v sekci "Tools".  
