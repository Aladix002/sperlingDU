
export interface ValidationRule {
  min?: number;
  max?: number;
  pattern?: RegExp;
  message: string;
  helpText?: string;
}

export const validationRules: Record<string, ValidationRule> = {
  accountantEmail: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Neplatný formát emailové adresy účetní",
    helpText: "Aktuálně ekonom@vetkom.cz - email pro faktury a platební komunikaci"
  },
  
  cpdFee: {
    min: 1,
    max: 999999,
    message: "Poplatek za CPD musí být kladné číslo v Kč",
    helpText: "Celé kladné číslo v Kč, výchozí hodnota je 500 bez DPH"
  },
  
  invoiceDueDays: {
    min: 1,
    max: 365,
    message: "Splatnost faktur musí být mezi 1 a 365 dny",
    helpText: "Celé kladné číslo ve dnech, výchozí hodnota je 14"
  },
  
  paymentUrgencyDays: {
    min: 1,
    max: 365,
    message: "Lhůta pro urgenci platby musí být mezi 1 a 365 dny",
    helpText: "Celé kladné číslo ve dnech, výchozí hodnota je 30 dní; počítá se jako doba před konáním Akce"
  },
  
  paymentUrgencyPeriodDays: {
    min: 1,
    max: 30,
    message: "Perioda urgence platby musí být mezi 1 a 30 dny",
    helpText: "Celé kladné číslo ve dnech, výchozí hodnota je 3 dny"
  },
  
  actionNotificationDays: {
    min: 0,
    max: 365,
    message: "Lhůta upozornění na akci musí být mezi 0 a 365 dny",
    helpText: "Celé kladné číslo ve dnech, výchozí hodnota je 7 dní; počítá se jako doba před konáním Akce"
  },
  
  lastActionNotificationHours: {
    min: 0,
    max: 8760,
    message: "Lhůta posledního upozornění musí být mezi 0 a 8760 hodinami",
    helpText: "Celé kladné číslo v hodinách, výchozí hodnota je 24 hodin; počítá se jako doba před konáním Akce"
  },
  
  surveyReminderDays: {
    min: 0,
    max: 365,
    message: "Lhůta pro připomenutí dotazníku musí být mezi 0 a 365 dny",
    helpText: "Celé kladné číslo ve dnech, výchozí hodnota je 14 dní; počítá se jako doba od odeslání dotazníku garantovi"
  },
  
  cpdYearsCount: {
    min: 1,
    max: 10,
    message: "Počet let součtu CPD musí být mezi 1 a 10 lety",
    helpText: "Za kolik předchozích let se sčítají CPD body, výchozí hodnota je 3 roky"
  },
  
  cpdClosureUrgencyDays: {
    min: 1,
    max: 365,
    message: "Lhůta urgence uzávěrky CPD musí být mezi 1 a 365 dny",
    helpText: "Celé kladné číslo ve dnech, obvykle 30 dní"
  },
  
  cpdClosureUrgencyPeriodDays: {
    min: 1,
    max: 30,
    message: "Perioda urgence uzávěrky CPD musí být mezi 1 a 30 dny",
    helpText: "Celé kladné číslo ve dnech, výchozí hodnota je 5 dnů"
  },
  
  invoiceSeriesIssued: {
    pattern: /^[1-9][0-9]{5}$/,
    message: "Číselná řada faktur vydaných musí být ve formátu XrrNNN (např. 324123)",
    helpText: "Saldokontní číselná řada ve struktuře XrrNNN, např. 324123 (123. faktura v pořadí roku 2024 v řadě č. 3)"
  },
  
  invoiceSeriesReceived: {
    pattern: /^[1-9][0-9]{5}$/,
    message: "Číselná řada daňových dokladů o přijaté platbě musí být ve formátu XrrNNN (např. 124456)",
    helpText: "Saldokontní číselná řada ve struktuře XrrNNN, např. 124456 (456. faktura v pořadí roku 2024 v řadě č. 1)"
  },
  
  invoiceSeriesSettlement: {
    pattern: /^[1-9][0-9]{5}$/,
    message: "Číselná řada faktur zúčtovacích musí být ve formátu XrrNNN (např. 224789)",
    helpText: "Saldokontní číselná řada ve struktuře XrrNNN, např. 224789 (789. faktura v pořadí roku 2024 v řadě č. 2)"
  },
  
  defaultCertificationYears: {
    min: 1,
    max: 10,
    message: "Výchozí doba platnosti certifikace musí být mezi 1 a 10 lety",
    helpText: "V letech; použije se jako předvyplněná pro nastavení doby platnosti certifikace, výchozí hodnota je 5 let"
  },
  
  certificationExpiryThresholdDays: {
    min: 1,
    max: 365,
    message: "Práh expirace certifikace musí být mezi 1 a 365 dny",
    helpText: "Doba definovaná ve dnech, která určuje od data expirace zpětně dobu, kdy se certifikace bude ukazovat na semaforu oranžovou"
  },
  
  defaultStudentDiscount: {
    min: 0,
    max: 100,
    message: "Výchozí sleva pro studenty musí být mezi 0% a 100%",
    helpText: "V %, aktuálně 30%"
  },
  
  defaultNonMemberSurcharge: {
    min: 0,
    max: 100,
    message: "Výchozí přirážka pro nečleny musí být mezi 0% a 100%",
    helpText: "V %, aktuálně 30%"
  }
};

export const validateField = (fieldName: string, value: any): string | null => {
  const rule = validationRules[fieldName];
  if (!rule) return null;

  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (rule.pattern && !rule.pattern.test(value)) {
    return rule.message;
  }

  if (rule.min !== undefined && value < rule.min) {
    return rule.message;
  }
  if (rule.max !== undefined && value > rule.max) {
    return rule.message;
  }

  return null;
};

export const validateAllFields = (settings: any): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(validationRules).forEach(fieldName => {
    const error = validateField(fieldName, settings[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  return errors;
};

export const areAllFieldsFilled = (settings: any): boolean => {
  return Object.keys(validationRules).every(fieldName => {
    const value = settings[fieldName];
    return value !== null && value !== undefined && value !== '';
  });
};
