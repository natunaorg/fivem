"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audio = void 0;
class Audio {
    static playSoundAt(position, sound, set) {
        PlaySoundFromCoord(-1, sound, position.x, position.y, position.z, set ? set : null, false, 0, false);
        return GetSoundId();
    }
    static playSoundFromEntity(entity, sound, set) {
        PlaySoundFromEntity(-1, sound, entity.Handle, set ? set : null, false, 0);
        return GetSoundId();
    }
    static playSoundFrontEnd(sound, set) {
        PlaySoundFrontend(-1, sound, set ? set : null, false);
        return GetSoundId();
    }
    static stopSound(soundId) {
        StopSound(soundId);
    }
    static releaseSound(soundId) {
        ReleaseSoundId(soundId);
    }
    static hasSoundFinished(soundId) {
        return !!HasSoundFinished(soundId);
    }
    static setAudioFlag(flag, toggle) {
        if (typeof flag === 'string') {
            SetAudioFlag(flag, toggle);
        }
        else {
            SetAudioFlag(this.audioFlags[Number(flag)], toggle);
        }
    }
    static playSound(soundFile, soundSet) {
        this.releaseSound(this.playSoundFrontEnd(soundFile, soundSet));
    }
    static playMusic(musicFile) {
        if (this.cachedMusicFile !== null) {
            CancelMusicEvent(musicFile);
        }
        this.cachedMusicFile = musicFile;
        TriggerMusicEvent(musicFile);
    }
    static stopMusic(musicFile) {
        if (musicFile === null) {
            if (this.cachedMusicFile !== null) {
                CancelMusicEvent(this.cachedMusicFile);
                this.cachedMusicFile = null;
            }
        }
        else {
            CancelMusicEvent(musicFile);
        }
    }
}
exports.Audio = Audio;
Audio.audioFlags = [
    'ActivateSwitchWheelAudio',
    'AllowCutsceneOverScreenFade',
    'AllowForceRadioAfterRetune',
    'AllowPainAndAmbientSpeechToPlayDuringCutscene',
    'AllowPlayerAIOnMission',
    'AllowPoliceScannerWhenPlayerHasNoControl',
    'AllowRadioDuringSwitch',
    'AllowRadioOverScreenFade',
    'AllowScoreAndRadio',
    'AllowScriptedSpeechInSlowMo',
    'AvoidMissionCompleteDelay',
    'DisableAbortConversationForDeathAndInjury',
    'DisableAbortConversationForRagdoll',
    'DisableBarks',
    'DisableFlightMusic',
    'DisableReplayScriptStreamRecording',
    'EnableHeadsetBeep',
    'ForceConversationInterrupt',
    'ForceSeamlessRadioSwitch',
    'ForceSniperAudio',
    'FrontendRadioDisabled',
    'HoldMissionCompleteWhenPrepared',
    'IsDirectorModeActive',
    'IsPlayerOnMissionForSpeech',
    'ListenerReverbDisabled',
    'LoadMPData',
    'MobileRadioInGame',
    'OnlyAllowScriptTriggerPoliceScanner',
    'PlayMenuMusic',
    'PoliceScannerDisabled',
    'ScriptedConvListenerMaySpeak',
    'SpeechDucksScore',
    'SuppressPlayerScubaBreathing',
    'WantedMusicDisabled',
    'WantedMusicOnMission',
];
