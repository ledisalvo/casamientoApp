-- Reemplaza la frase de Pablo Neruda por el versículo de Eclesiastés 4:9-12.
-- El valor de app_config tiene precedencia sobre el fallback del componente QuoteSection.
update app_config
  set value = 'Más valen dos que uno...\nSi caen, el uno levanta al otro...\nUno solo puede ser vencido, pero dos pueden resistir.\n¡La cuerda de tres hilos no se rompe fácilmente!'
  where key = 'quote_text';

update app_config
  set value = '— Eclesiastés 4:9-12'
  where key = 'quote_author';
