#ifndef UPDATER_H
#define UPDATER_H

#include <Arduino.h>

enum class FSUpdaterStatus
{
    INIT = 255,
    FLASHING = 254,
    ERROR = 0 ,
    SUCCESS = 1
};

class LittleFSUpdater
{

private:
    String filename;
    bool requestFlag = false;
    FSUpdaterStatus status = FSUpdaterStatus::INIT;
    void flash(String filename);

public:
    void requestStart(String filename);
    void loop();
    uint8_t getStatus();
    FSUpdaterStatus getStatusEnum();
};

extern LittleFSUpdater updater;

#endif