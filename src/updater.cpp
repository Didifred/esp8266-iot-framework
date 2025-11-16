#include "updater.h"

#include "LittleFS.h"

void LittleFSUpdater::requestStart(String filenameIn)
{
    status = FSUpdaterStatus::FLASHING;
    filename = filenameIn;
    requestFlag = true;
}

void LittleFSUpdater::loop()
{
    if (requestFlag==true)
    {
        requestFlag = false;
        flash(filename);
    }
}

uint8_t LittleFSUpdater::getStatus()
{
    return (uint8_t)status;
}

FSUpdaterStatus LittleFSUpdater::getStatusEnum()
{
    return status;
}

void LittleFSUpdater::flash(String filename)
{    
    bool success = false;
    File file = LittleFS.open(filename, "r");

    if (!file)
    {
        Serial.println(PSTR("Failed to open file for reading"));
    }
    else
    {
        Serial.println(PSTR("Starting update.."));

        size_t fileSize = file.size();

        if (!Update.begin(fileSize))
        {
            Serial.println(PSTR("Not enough space for update"));
        }
        else
        {
            Update.writeStream(file);

            if (Update.end())
            {
                Serial.println(PSTR("Successful update"));
                success = true;
            }
            else
            {

                Serial.println(PSTR("Error Occurred: ") + String(Update.getError()));
            }
        }

        file.close();
    }
    
    status = success ? FSUpdaterStatus::SUCCESS : FSUpdaterStatus::ERROR;
}

LittleFSUpdater updater;
