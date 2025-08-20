# Sperling DU - Implementované Řešení

📹 **[Video demonštrácia projektu](https://drive.google.com/file/d/11BCBAtC_j9NOR0vjN5DERVSGYT6zBTcF/view?usp=sharing)**

## Jak Spustit

### Backend
```bash
cd SperlingDU.API
dotnet run
```

### Frontend  
```bash
cd SperlingDU.CLIENT
npm install
npm run dev
```

## Architektura

### **DAL (Data Access Vrstva)**
- **Entities:** C# třídy které reprezentují databázové tabulky
- **Repository:** Generické rozhraní pro všechny entity
- **DbContext:** Entity Framework kontext pro MySQL
- **UnitOfWork:** Správa transakcí a commit/rollback

### **BLL (Business Logic Vrstva)**
- **Services:** Implementují business pravidla a validaci
- **Facades:** Veřejné rozhraní pro API (Facade pattern)
- **Mappers:** Transformují Entity ↔ DTO pomocí AutoMapper
- **Dependency Injection:** Všechny závislosti se injektují přes constructor

### **API (REST API Vrstva)**
**Úloha:** HTTP endpointy a serializace JSON
- **Controllers:** HTTP endpointy pro každou entitu
- **DTOs:** Data Transfer Objects pro API komunikaci
- **Validation:** Model validace a error handling
- **Swagger:** Automatická dokumentace API

### **CLIENT (React Frontend)**
**Úloha:** Uživatelské rozhraní a API komunikace
- **Components:** React komponenty pro každou funkcionalitu
- **API Service:** Axios pro HTTP volání na backend
- **State Management:** React Query pro server state
- **TinyMCE:** Rich text editor pro emailové šablony
- **⚠️ Poznámka:** Vkládání a čtení proměnných v editorech ještě není správně implementováno a je potřeba to opravit. Skoušel jsem i vlastní editor kde to s proměnnými fungovalo, ale po návratu na TinyMCE mám problém s vkládáním proměnných a musím to opravit.

## Časové rozložení

### Backend vývoj
- **DAL (Data Access Layer):** ~2 hodiny
  - Vytvoření entit (EmailTemplate, FileAttachment, SystemSettings)
  - Repository pattern implementace
  - DbContext a MySQL konfigurace
  - Migrace a seed data

- **BLL (Business Logic Layer):** ~2 hodiny
  - Services, Facades a Mappers implementace
  - Dependency Injection nastavení
  - AutoMapper konfigurace
  - Business logika a validace

- **API (REST API):** ~2 hodiny
  - Controllers pro všechny entity
  - DTOs a model validation
  - Swagger dokumentace
  - Error handling

### Frontend vývoj
- **CLIENT základní nastavení:** ~5 hodin
  - Učení se React
  - React + TypeScript setup
  - Tailwind CSS konfigurace
  - Routing a základní komponenty
  - API service a React Query

### Nejdéle trvající části
- **Emailové šablony a TinyMCE:** ~5 hodin celkem
  - TinyMCE editor implementace
  - ⚠️ **Vkládání proměnných z databáze** - ještě není správně implementované
  - ⚠️ **Čtení proměnných** - ještě není správně implementované
  - Export do PDF/DOCX
  - Opravy entit a databázových problémů
  - Učení se React a TinyMCE funkcím

### Celkový čas vývoje
**Přibližně 17 hodin** aktivního řešení a učení

## TODO - Co ještě treba dokončit

### 🔴 Problémy
- **Vkládání proměnných v TinyMCE editoru** - implementovat správně vkládání proměnných z databáze do editora (vlastní editor fungoval, TinyMCE má problém)
- **Čtení proměnných z TinyMCE editora** - implementovat správně čtení a parsování proměnných z TinyMCE obsahu
- **PDF export** - opravit export do PDF, který ještě nefunguje v podobě jaké by měl 












