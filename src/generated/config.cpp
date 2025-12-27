#include <Arduino.h>
#include "config.h"

uint32_t configVersion = 2489468524; //generated identifier to compare config with EEPROM

const configData defaults PROGMEM =
{
	"Smart Solar Router",
	"en",
	0.25,
	0.9,
	0.0
};