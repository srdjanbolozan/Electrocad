import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  Position,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import 'reactflow/dist/style.css';

// -------------------------------------------------------------
// STIL ZA PINOVE (POSTAVLJAJU SE TAČNO PREKO RUPA NA SLICI)
// -------------------------------------------------------------
const pinStyle = {
  width: '5px',
  height: '5px',
  borderRadius: '50%',
  border: '1px solid #ffffff',
  zIndex: 30,
};

// -------------------------------------------------------------
// ESP32 NODE - PINOVI RAŠIRENI KA SPOLJA I SPUŠTENI NANIŽE
// -------------------------------------------------------------
const ESP32Node = ({ id }) => (
  <div style={{ position: 'relative', width: '130px', height: '260px' }}>
    <img
      src={process.env.PUBLIC_URL + '/esp32.png'}
      alt="ESP32 Board"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '16px', // <--- DODATO: Podešava koliko su uglovi zaobljeni (npr. 8px ili 12px)
        overflow: 'hidden',
        filter: 'drop-shadow(0px 6px 10px rgba(0,0,0,0.6))',
      }}
    />
{/* LEVA STRANA PINOVA (left: 3.5px, korak: 13.6px) */}
    <Handle type="source" position={Position.Left} id={`${id}-en`} style={{ ...pinStyle, top: '30px', left: '3.5px', background: '#94a3b8' }} title="EN" />
    <Handle type="source" position={Position.Left} id={`${id}-vp`} style={{ ...pinStyle, top: '43.6px', left: '3.5px', background: '#f9e2af' }} title="VP (GPIO36)" />
    <Handle type="source" position={Position.Left} id={`${id}-vn`} style={{ ...pinStyle, top: '57.2px', left: '3.5px', background: '#f9e2af' }} title="VN (GPIO39)" />
    <Handle type="source" position={Position.Left} id={`${id}-d34`} style={{ ...pinStyle, top: '70.8px', left: '3.5px', background: '#f9e2af' }} title="D34" />
    <Handle type="source" position={Position.Left} id={`${id}-d35`} style={{ ...pinStyle, top: '84.4px', left: '3.5px', background: '#f9e2af' }} title="D35" />
    <Handle type="source" position={Position.Left} id={`${id}-d32`} style={{ ...pinStyle, top: '98px', left: '3.5px', background: '#89b4fa' }} title="D32" />
    <Handle type="source" position={Position.Left} id={`${id}-d33`} style={{ ...pinStyle, top: '111.6px', left: '3.5px', background: '#89b4fa' }} title="D33" />
    <Handle type="source" position={Position.Left} id={`${id}-d25`} style={{ ...pinStyle, top: '125.2px', left: '3.5px', background: '#89b4fa' }} title="D25" />
    <Handle type="source" position={Position.Left} id={`${id}-d26`} style={{ ...pinStyle, top: '138.8px', left: '3.5px', background: '#89b4fa' }} title="D26" />
    <Handle type="source" position={Position.Left} id={`${id}-d27`} style={{ ...pinStyle, top: '152.4px', left: '3.5px', background: '#89b4fa' }} title="D27" />
    <Handle type="source" position={Position.Left} id={`${id}-d14`} style={{ ...pinStyle, top: '166px', left: '3.5px', background: '#89b4fa' }} title="D14" />
    <Handle type="source" position={Position.Left} id={`${id}-d12`} style={{ ...pinStyle, top: '179.6px', left: '3.5px', background: '#89b4fa' }} title="D12" />
    <Handle type="source" position={Position.Left} id={`${id}-d13`} style={{ ...pinStyle, top: '193.2px', left: '3.5px', background: '#89b4fa' }} title="D13" />
    <Handle type="source" position={Position.Left} id={`${id}-gnd1`} style={{ ...pinStyle, top: '206.8px', left: '3.5px', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Left} id={`${id}-vin`} style={{ ...pinStyle, top: '220.4px', left: '3.5px', background: '#ff0000' }} title="VIN (+5V)" />

    {/* DESNA STRANA PINOVA (right: 3px, korak: 13.6px) */}
    <Handle type="source" position={Position.Right} id={`${id}-d23`} style={{ ...pinStyle, top: '30px', right: '3px', background: '#89b4fa' }} title="D23" />
    <Handle type="source" position={Position.Right} id={`${id}-d22`} style={{ ...pinStyle, top: '43.6px', right: '3px', background: '#89b4fa' }} title="D22" />
    <Handle type="source" position={Position.Right} id={`${id}-txd`} style={{ ...pinStyle, top: '57.2px', right: '3px', background: '#fab387' }} title="TX0" />
    <Handle type="source" position={Position.Right} id={`${id}-rxd`} style={{ ...pinStyle, top: '70.8px', right: '3px', background: '#fab387' }} title="RX0" />
    <Handle type="source" position={Position.Right} id={`${id}-d21`} style={{ ...pinStyle, top: '84.4px', right: '3px', background: '#89b4fa' }} title="D21" />
    <Handle type="source" position={Position.Right} id={`${id}-d19`} style={{ ...pinStyle, top: '98px', right: '3px', background: '#89b4fa' }} title="D19" />
    <Handle type="source" position={Position.Right} id={`${id}-d18`} style={{ ...pinStyle, top: '111.6px', right: '3px', background: '#89b4fa' }} title="D18" />
    <Handle type="source" position={Position.Right} id={`${id}-d5`} style={{ ...pinStyle, top: '125.2px', right: '3px', background: '#89b4fa' }} title="D5" />
    <Handle type="source" position={Position.Right} id={`${id}-tx2`} style={{ ...pinStyle, top: '138.8px', right: '3px', background: '#fab387' }} title="TX2" />
    <Handle type="source" position={Position.Right} id={`${id}-rx2`} style={{ ...pinStyle, top: '152.4px', right: '3px', background: '#fab387' }} title="RX2" />
    <Handle type="source" position={Position.Right} id={`${id}-d4`} style={{ ...pinStyle, top: '166px', right: '3px', background: '#89b4fa' }} title="D4" />
    <Handle type="source" position={Position.Right} id={`${id}-d2`} style={{ ...pinStyle, top: '179.6px', right: '3px', background: '#89b4fa' }} title="D2" />
    <Handle type="source" position={Position.Right} id={`${id}-d15`} style={{ ...pinStyle, top: '193.2px', right: '3px', background: '#89b4fa' }} title="D15" />
    <Handle type="source" position={Position.Right} id={`${id}-gnd2`} style={{ ...pinStyle, top: '206.8px', right: '3px', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Right} id={`${id}-3v3`} style={{ ...pinStyle, top: '220.4px', right: '3px', background: '#ff0000' }} title="3V3" />
  </div>
);






// RESTA OSTALIH NODEOVA (STILIZOVANE PLOČE)
const MQ2Node = ({ id }) => (
  <div style={{ position: 'relative', width: '110px', height: '170px' }}>
    <img
      src={process.env.PUBLIC_URL + '/MQ-2Sensor.png'}
      alt="MQ-2 Senzor"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '12px',
        overflow: 'hidden',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))',
      }}
    />

    {/* PINOVI NA DNU: VCC, GND, AO, DO */}
    <Handle
      type="source"
      position={Position.Bottom}
      id={`${id}-vcc`}
      style={{ ...pinStyle, left: '31%', bottom: '4px', background: '#ff0000' }}
      title="VCC (+5V)"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id={`${id}-gnd`}
      style={{ ...pinStyle, left: '44%', bottom: '4px', background: '#000000' }}
      title="GND"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id={`${id}-ao`}
      style={{ ...pinStyle, left: '56%', bottom: '4px', background: '#f9e2af' }}
      title="A0 (Analog Out)"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id={`${id}-do`}
      style={{ ...pinStyle, left: '69%', bottom: '4px', background: '#89b4fa' }}
      title="D0 (Digital Out)"
    />
  </div>
);


const LedNode = ({ id }) => (
  <div style={{ position: 'relative', width: '60px', height: '130px' }}>
    <img
      src={process.env.PUBLIC_URL + '/led.png'}
      alt="LED Dioda"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))',
      }}
    />

    {/* PINOVI NA DNU: ANODA (Levo / +) i KATODA (Desno / -) */}
    <Handle
      type="source"
      position={Position.Bottom}
      id={`${id}-anode`}
      style={{ ...pinStyle, left: '33%', bottom: '2px', background: '#ff0000' }}
      title="Anoda (+)"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id={`${id}-cathode`}
      style={{ ...pinStyle, left: '70%', bottom: '2px', background: '#000000' }}
      title="Katoda (-)"
    />
  </div>
);

const ArduinoNanoNode = ({ id }) => (
  <div style={{ position: 'relative', width: '120px', height: '280px' }}>
    <img
      src={process.env.PUBLIC_URL + '/nano.png'}
      alt="Arduino Nano"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '12px',
        overflow: 'hidden',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))',
      }}
    />

    {/* --- LEVA STRANA PINOVA (od vrha do dna) --- */}
    <Handle type="source" position={Position.Left} id={`${id}-d13`} style={{ ...pinStyle, top: '9.4%', left: '7px', background: '#89b4fa' }} title="D13" />
    <Handle type="source" position={Position.Left} id={`${id}-3v3`} style={{ ...pinStyle, top: '15.2%', left: '7px', background: '#fab387' }} title="3.3V" />
    <Handle type="source" position={Position.Left} id={`${id}-aref`} style={{ ...pinStyle, top: '21.2%', left: '7px', background: '#cba6f7' }} title="REF" />
    <Handle type="source" position={Position.Left} id={`${id}-a0`} style={{ ...pinStyle, top: '27.2%', left: '7px', background: '#f9e2af' }} title="A0" />
    <Handle type="source" position={Position.Left} id={`${id}-a1`} style={{ ...pinStyle, top: '33.2%', left: '7px', background: '#f9e2af' }} title="A1" />
    <Handle type="source" position={Position.Left} id={`${id}-a2`} style={{ ...pinStyle, top: '38.8%', left: '7px', background: '#f9e2af' }} title="A2" />
    <Handle type="source" position={Position.Left} id={`${id}-a3`} style={{ ...pinStyle, top: '44.8%', left: '7px', background: '#f9e2af' }} title="A3" />
    <Handle type="source" position={Position.Left} id={`${id}-a4`} style={{ ...pinStyle, top: '50.8%', left: '7px', background: '#f9e2af' }} title="A4" />
    <Handle type="source" position={Position.Left} id={`${id}-a5`} style={{ ...pinStyle, top: '56.6%', left: '7px', background: '#f9e2af' }} title="A5" />
    <Handle type="source" position={Position.Left} id={`${id}-a6`} style={{ ...pinStyle, top: '62.5%', left: '7px', background: '#f9e2af' }} title="A6" />
    <Handle type="source" position={Position.Left} id={`${id}-a7`} style={{ ...pinStyle, top: '68.2%', left: '7px', background: '#f9e2af' }} title="A7" />
    <Handle type="source" position={Position.Left} id={`${id}-5v`} style={{ ...pinStyle, top: '73.9%', left: '7px', background: '#ff0000' }} title="5V" />
    <Handle type="source" position={Position.Left} id={`${id}-rst1`} style={{ ...pinStyle, top: '80.0%', left: '7px', background: '#f38ba8' }} title="RST" />
    <Handle type="source" position={Position.Left} id={`${id}-gnd1`} style={{ ...pinStyle, top: '85.8%', left: '7px', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Left} id={`${id}-vin`} style={{ ...pinStyle, top: '91.6%', left: '7px', background: '#a6e3a1' }} title="VIN" />

    {/* --- DESNA STRANA PINOVA (od vrha do dna) --- */}
    <Handle type="source" position={Position.Right} id={`${id}-d12`} style={{ ...pinStyle, top: '9.4%', right: '7px', background: '#89b4fa' }} title="D12" />
    <Handle type="source" position={Position.Right} id={`${id}-d11`} style={{ ...pinStyle, top: '15.2%', right: '7px', background: '#89b4fa' }} title="D11" />
    <Handle type="source" position={Position.Right} id={`${id}-d10`} style={{ ...pinStyle, top: '21.2%', right: '7px', background: '#89b4fa' }} title="D10" />
    <Handle type="source" position={Position.Right} id={`${id}-d9`} style={{ ...pinStyle, top: '27.2%', right: '7px', background: '#89b4fa' }} title="D9" />
    <Handle type="source" position={Position.Right} id={`${id}-d8`} style={{ ...pinStyle, top: '33.2%', right: '7px', background: '#89b4fa' }} title="D8" />
    <Handle type="source" position={Position.Right} id={`${id}-d7`} style={{ ...pinStyle, top: '38.8%', right: '7px', background: '#89b4fa' }} title="D7" />
    <Handle type="source" position={Position.Right} id={`${id}-d6`} style={{ ...pinStyle, top: '44.8%', right: '7px', background: '#89b4fa' }} title="D6" />
    <Handle type="source" position={Position.Right} id={`${id}-d5`} style={{ ...pinStyle, top: '50.8%', right: '7px', background: '#89b4fa' }} title="D5" />
    <Handle type="source" position={Position.Right} id={`${id}-d4`} style={{ ...pinStyle, top: '56.6%', right: '7px', background: '#89b4fa' }} title="D4" />
    <Handle type="source" position={Position.Right} id={`${id}-d3`} style={{ ...pinStyle, top: '62.5%', right: '7px', background: '#89b4fa' }} title="D3" />
    <Handle type="source" position={Position.Right} id={`${id}-d2`} style={{ ...pinStyle, top: '68.2%', right: '7px', background: '#89b4fa' }} title="D2" />
    <Handle type="source" position={Position.Right} id={`${id}-gnd2`} style={{ ...pinStyle, top: '73.9%', right: '7px', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Right} id={`${id}-rst2`} style={{ ...pinStyle, top: '80.0%', right: '7px', background: '#f38ba8' }} title="RST" />
    <Handle type="source" position={Position.Right} id={`${id}-rx0`} style={{ ...pinStyle, top: '85.8%', right: '7px', background: '#89b4fa' }} title="RX0" />
    <Handle type="source" position={Position.Right} id={`${id}-tx1`} style={{ ...pinStyle, top: '91.6%', right: '7px', background: '#89b4fa' }} title="TX1" />
  </div>
);


const ArduinoUnoNode = ({ id }) => (
  <div style={{ position: 'relative', width: '320px', height: '240px' }}>
    <img
      src={process.env.PUBLIC_URL + '/uno.png'}
      alt="Arduino Uno"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '6px',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))',
      }}
    />

    {/* --- GORNJI PINOVI (Digitalni & Ref/GND) - s leva na desno --- */}
    <Handle type="source" position={Position.Top} id={`${id}-aref`} style={{ ...pinStyle, top: '4%', left: '33.8%', background: '#cba6f7' }} title="AREF" />
    <Handle type="source" position={Position.Top} id={`${id}-gnd1`} style={{ ...pinStyle, top: '4%', left: '37.8%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Top} id={`${id}-d13`} style={{ ...pinStyle, top: '4%', left: '41.8%', background: '#89b4fa' }} title="D13" />
    <Handle type="source" position={Position.Top} id={`${id}-d12`} style={{ ...pinStyle, top: '4%', left: '45.8%', background: '#89b4fa' }} title="D12" />
    <Handle type="source" position={Position.Top} id={`${id}-d11`} style={{ ...pinStyle, top: '4%', left: '49.8%', background: '#89b4fa' }} title="~D11" />
    <Handle type="source" position={Position.Top} id={`${id}-d10`} style={{ ...pinStyle, top: '4%', left: '53.8%', background: '#89b4fa' }} title="~D10" />
    <Handle type="source" position={Position.Top} id={`${id}-d9`} style={{ ...pinStyle, top: '4%', left: '57.8%', background: '#89b4fa' }} title="~D9" />
    <Handle type="source" position={Position.Top} id={`${id}-d8`} style={{ ...pinStyle, top: '4%', left: '61.8%', background: '#89b4fa' }} title="D8" />

    <Handle type="source" position={Position.Top} id={`${id}-d7`} style={{ ...pinStyle, top: '4%', left: '68.0%', background: '#89b4fa' }} title="D7" />
    <Handle type="source" position={Position.Top} id={`${id}-d6`} style={{ ...pinStyle, top: '4%', left: '72.0%', background: '#89b4fa' }} title="~D6" />
    <Handle type="source" position={Position.Top} id={`${id}-d5`} style={{ ...pinStyle, top: '4%', left: '76.0%', background: '#89b4fa' }} title="~D5" />
    <Handle type="source" position={Position.Top} id={`${id}-d4`} style={{ ...pinStyle, top: '4%', left: '80.0%', background: '#89b4fa' }} title="D4" />
    <Handle type="source" position={Position.Top} id={`${id}-d3`} style={{ ...pinStyle, top: '4%', left: '84.0%', background: '#89b4fa' }} title="~D3" />
    <Handle type="source" position={Position.Top} id={`${id}-d2`} style={{ ...pinStyle, top: '4%', left: '88.0%', background: '#89b4fa' }} title="D2" />
    <Handle type="source" position={Position.Top} id={`${id}-tx`} style={{ ...pinStyle, top: '4%', left: '92.0%', background: '#89b4fa' }} title="TX>1" />
    <Handle type="source" position={Position.Top} id={`${id}-rx`} style={{ ...pinStyle, top: '4%', left: '96.0%', background: '#89b4fa' }} title="RX<0" />

    {/* --- DONJI PINOVI - POWER (s leva na desno) --- */}
    <Handle type="source" position={Position.Bottom} id={`${id}-ioref`} style={{ ...pinStyle, bottom: '4%', left: '40.8%', background: '#fab387' }} title="IOREF" />
    <Handle type="source" position={Position.Bottom} id={`${id}-rst`} style={{ ...pinStyle, bottom: '4%', left: '45.2%', background: '#f38ba8' }} title="RESET" />
    <Handle type="source" position={Position.Bottom} id={`${id}-3v3`} style={{ ...pinStyle, bottom: '4%', left: '49.8%', background: '#fab387' }} title="3.3V" />
    <Handle type="source" position={Position.Bottom} id={`${id}-5v`} style={{ ...pinStyle, bottom: '4%', left: '54.2%', background: '#ff0000' }} title="5V" />
    <Handle type="source" position={Position.Bottom} id={`${id}-gnd2`} style={{ ...pinStyle, bottom: '4%', left: '58.8%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Bottom} id={`${id}-gnd3`} style={{ ...pinStyle, bottom: '4%', left: '63.2%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Bottom} id={`${id}-vin`} style={{ ...pinStyle, bottom: '4%', left: '67.8%', background: '#a6e3a1' }} title="VIN" />

    {/* --- DONJI PINOVI - ANALOG IN (s leva na desno) --- */}
    <Handle type="source" position={Position.Bottom} id={`${id}-a0`} style={{ ...pinStyle, bottom: '4%', left: '74.2%', background: '#f9e2af' }} title="A0" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a1`} style={{ ...pinStyle, bottom: '4%', left: '78.5%', background: '#f9e2af' }} title="A1" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a2`} style={{ ...pinStyle, bottom: '4%', left: '83.0%', background: '#f9e2af' }} title="A2" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a3`} style={{ ...pinStyle, bottom: '4%', left: '87.5%', background: '#f9e2af' }} title="A3" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a4`} style={{ ...pinStyle, bottom: '4%', left: '91.8%', background: '#f9e2af' }} title="A4" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a5`} style={{ ...pinStyle, bottom: '4%', left: '96.0%', background: '#f9e2af' }} title="A5" />
  </div>
);

const LedArrayNode = ({ id }) => (
  <div style={{ position: 'relative', width: '280px', height: '180px' }}>
    <img
      src={process.env.PUBLIC_URL + '/6leddioda.png'}
      alt="6 LED Module"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '12px',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))',
      }}
    />

    {/* --- LEVI CRNI KONEKTOR (GND, LED1, LED2, LED3) --- */}
    <Handle type="source" position={Position.Bottom} id={`${id}-gnd1`} style={{ ...pinStyle, bottom: '26%', left: '18.5%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Bottom} id={`${id}-led1`} style={{ ...pinStyle, bottom: '26%', left: '26.0%', background: '#ff0000' }} title="LED1" />
    <Handle type="source" position={Position.Bottom} id={`${id}-led2`} style={{ ...pinStyle, bottom: '26%', left: '33.5%', background: '#ff0000' }} title="LED2" />
    <Handle type="source" position={Position.Bottom} id={`${id}-led3`} style={{ ...pinStyle, bottom: '26%', left: '41.0%', background: '#ff0000' }} title="LED3" />

    {/* --- DESNI CRNI KONEKTOR (LED4, LED5, LED6, GND) --- */}
    <Handle type="source" position={Position.Bottom} id={`${id}-led4`} style={{ ...pinStyle, bottom: '24%', left: '59.0%', background: '#ff0000' }} title="LED4" />
    <Handle type="source" position={Position.Bottom} id={`${id}-led5`} style={{ ...pinStyle, bottom: '24%', left: '66.5%', background: '#ff0000' }} title="LED5" />
    <Handle type="source" position={Position.Bottom} id={`${id}-led6`} style={{ ...pinStyle, bottom: '24%', left: '74.0%', background: '#ff0000' }} title="LED6" />
    <Handle type="source" position={Position.Bottom} id={`${id}-gnd2`} style={{ ...pinStyle, bottom: '24%', left: '81.5%', background: '#000000' }} title="GND" />
  </div>
);
const SevenSegmentNode = ({ id }) => (
  <div style={{ position: 'relative', width: '220px', height: '260px' }}>
    <img
      src={process.env.PUBLIC_URL + '/7segment.png'}
      alt="7 Segment Display Module"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '16px',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))',
      }}
    />

    {/* --- LEVI CRNI KONEKTOR: COM, COM, DP, G, F --- */}
    <Handle type="source" position={Position.Bottom} id={`${id}-com1`} style={{ ...pinStyle, bottom: '13%', left: '5.2%', background: '#000000' }} title="COM" />
    <Handle type="source" position={Position.Bottom} id={`${id}-com2`} style={{ ...pinStyle, bottom: '13%', left: '13.8%', background: '#000000' }} title="COM" />
    <Handle type="source" position={Position.Bottom} id={`${id}-dp`} style={{ ...pinStyle, bottom: '13%', left: '22.4%', background: '#89b4fa' }} title="DP" />
    <Handle type="source" position={Position.Bottom} id={`${id}-g`} style={{ ...pinStyle, bottom: '13%', left: '31.0%', background: '#89b4fa' }} title="G" />
    <Handle type="source" position={Position.Bottom} id={`${id}-f`} style={{ ...pinStyle, bottom: '13%', left: '39.6%', background: '#89b4fa' }} title="F" />

    {/* --- DESNI CRNI KONEKTOR: E, D, C, B, A --- */}
    <Handle type="source" position={Position.Bottom} id={`${id}-e`} style={{ ...pinStyle, bottom: '13%', left: '60.4%', background: '#89b4fa' }} title="E" />
    <Handle type="source" position={Position.Bottom} id={`${id}-d`} style={{ ...pinStyle, bottom: '13%', left: '69.0%', background: '#89b4fa' }} title="D" />
    <Handle type="source" position={Position.Bottom} id={`${id}-c`} style={{ ...pinStyle, bottom: '13%', left: '77.6%', background: '#89b4fa' }} title="C" />
    <Handle type="source" position={Position.Bottom} id={`${id}-b`} style={{ ...pinStyle, bottom: '13%', left: '86.2%', background: '#89b4fa' }} title="B" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a`} style={{ ...pinStyle, bottom: '13%', left: '94.8%', background: '#89b4fa' }} title="A" />
  </div>
);

const NanoExtendedPinsNode = ({ id }) => (
  <div style={{ position: 'relative', width: '340px', height: '270px' }}>
    <img
      src={process.env.PUBLIC_URL + '/prosireninano.png'}
      alt="Arduino Nano Extended Header Pins"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '16px',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))',
      }}
    />

    {/* --- GORNJI RED MUŠKIH PINOVA (Sleva na desno) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-d12`} style={{ ...pinStyle, top: '17%', left: '11.0%', background: '#89b4fa' }} title="D12" />
    <Handle type="source" position={Position.Top} id={`${id}-d11`} style={{ ...pinStyle, top: '17%', left: '17.0%', background: '#89b4fa' }} title="D11" />
    <Handle type="source" position={Position.Top} id={`${id}-d10`} style={{ ...pinStyle, top: '17%', left: '22.5%', background: '#89b4fa' }} title="D10" />
    <Handle type="source" position={Position.Top} id={`${id}-d9`} style={{ ...pinStyle, top: '17%', left: '28.0%', background: '#89b4fa' }} title="D9" />
    <Handle type="source" position={Position.Top} id={`${id}-d8`} style={{ ...pinStyle, top: '17%', left: '33.5%', background: '#89b4fa' }} title="D8" />
    <Handle type="source" position={Position.Top} id={`${id}-d7`} style={{ ...pinStyle, top: '17%', left: '39.0%', background: '#89b4fa' }} title="D7" />
    <Handle type="source" position={Position.Top} id={`${id}-d6`} style={{ ...pinStyle, top: '17%', left: '44.5%', background: '#89b4fa' }} title="D6" />
    <Handle type="source" position={Position.Top} id={`${id}-d5`} style={{ ...pinStyle, top: '17%', left: '50.0%', background: '#89b4fa' }} title="D5" />
    <Handle type="source" position={Position.Top} id={`${id}-d4`} style={{ ...pinStyle, top: '17%', left: '55.7%', background: '#89b4fa' }} title="D4" />
    <Handle type="source" position={Position.Top} id={`${id}-d3`} style={{ ...pinStyle, top: '17%', left: '61.3%', background: '#89b4fa' }} title="D3" />
    <Handle type="source" position={Position.Top} id={`${id}-d2`} style={{ ...pinStyle, top: '17%', left: '67.0%', background: '#89b4fa' }} title="D2" />
    <Handle type="source" position={Position.Top} id={`${id}-gnd1`} style={{ ...pinStyle, top: '17%', left: '73.0%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Top} id={`${id}-rst1`} style={{ ...pinStyle, top: '17%', left: '78.5%', background: '#f38ba8' }} title="RST" />
    <Handle type="source" position={Position.Top} id={`${id}-rx`} style={{ ...pinStyle, top: '17%', left: '84.2%', background: '#89b4fa' }} title="RX" />
    <Handle type="source" position={Position.Top} id={`${id}-tx`} style={{ ...pinStyle, top: '17%', left: '90.0%', background: '#89b4fa' }} title="TX" />

    {/* --- DONJI RED MUŠKIH PINOVA (Sleva na desno) --- */}
    <Handle type="source" position={Position.Bottom} id={`${id}-d13`} style={{ ...pinStyle, bottom: '18%', left: '11.5%', background: '#89b4fa' }} title="D13" />
    <Handle type="source" position={Position.Bottom} id={`${id}-3v3`} style={{ ...pinStyle, bottom: '18%', left: '17.0%', background: '#fab387' }} title="3V3" />
    <Handle type="source" position={Position.Bottom} id={`${id}-ref`} style={{ ...pinStyle, bottom: '18%', left: '22.5%', background: '#cba6f7' }} title="REF" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a0`} style={{ ...pinStyle, bottom: '18%', left: '28.0%', background: '#f9e2af' }} title="A0" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a1`} style={{ ...pinStyle, bottom: '18%', left: '33.5%', background: '#f9e2af' }} title="A1" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a2`} style={{ ...pinStyle, bottom: '18%', left: '39.0%', background: '#f9e2af' }} title="A2" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a3`} style={{ ...pinStyle, bottom: '18%', left: '44.5%', background: '#f9e2af' }} title="A3" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a4`} style={{ ...pinStyle, bottom: '18%', left: '50.0%', background: '#f9e2af' }} title="A4" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a5`} style={{ ...pinStyle, bottom: '18%', left: '55.7%', background: '#f9e2af' }} title="A5" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a6`} style={{ ...pinStyle, bottom: '18%', left: '61.3%', background: '#f9e2af' }} title="A6" />
    <Handle type="source" position={Position.Bottom} id={`${id}-a7`} style={{ ...pinStyle, bottom: '18%', left: '67.0%', background: '#f9e2af' }} title="A7" />
    <Handle type="source" position={Position.Bottom} id={`${id}-5v`} style={{ ...pinStyle, bottom: '18%', left: '73.0%', background: '#ff0000' }} title="5V" />
    <Handle type="source" position={Position.Bottom} id={`${id}-rst2`} style={{ ...pinStyle, bottom: '18%', left: '78.5%', background: '#f38ba8' }} title="RST" />
    <Handle type="source" position={Position.Bottom} id={`${id}-gnd2`} style={{ ...pinStyle, bottom: '18%', left: '84.2%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Bottom} id={`${id}-vin`} style={{ ...pinStyle, bottom: '18%', left: '90.0%', background: '#a6e3a1' }} title="VIN" />
  </div>
);

const ButtonsModuleNode = ({ id }) => (
  <div style={{ position: 'relative', width: '300px', height: '160px' }}>
    <img
      src={process.env.PUBLIC_URL + '/buttons.png'}
      alt="Buttons Module"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '16px',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))',
      }}
    />

    {/* --- GORNJI KONEKTOR (+5V) - 5 PINOVA --- */}
    <Handle type="source" position={Position.Top} id={`${id}-5v-1`} style={{ ...pinStyle, top: '7.5%', left: '26.0%', background: '#ff0000' }} title="+5V" />
    <Handle type="source" position={Position.Top} id={`${id}-5v-2`} style={{ ...pinStyle, top: '7.5%', left: '30.8%', background: '#ff0000' }} title="+5V" />
    <Handle type="source" position={Position.Top} id={`${id}-5v-3`} style={{ ...pinStyle, top: '7.5%', left: '35.6%', background: '#ff0000' }} title="+5V" />
    <Handle type="source" position={Position.Top} id={`${id}-5v-4`} style={{ ...pinStyle, top: '7.5%', left: '40.4%', background: '#ff0000' }} title="+5V" />
    <Handle type="source" position={Position.Top} id={`${id}-5v-5`} style={{ ...pinStyle, top: '7.5%', left: '45.2%', background: '#ff0000' }} title="+5V" />

    {/* --- SREDNJI KONEKTOR (BTN1 do BTN5) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-btn1`} style={{ ...pinStyle, top: '28.0%', left: '37.8%', background: '#89b4fa' }} title="BTN1" />
    <Handle type="source" position={Position.Top} id={`${id}-btn2`} style={{ ...pinStyle, top: '28.0%', left: '42.6%', background: '#89b4fa' }} title="BTN2" />
    <Handle type="source" position={Position.Top} id={`${id}-btn3`} style={{ ...pinStyle, top: '28.0%', left: '47.4%', background: '#89b4fa' }} title="BTN3" />
    <Handle type="source" position={Position.Top} id={`${id}-btn4`} style={{ ...pinStyle, top: '28.0%', left: '52.2%', background: '#89b4fa' }} title="BTN4" />
    <Handle type="source" position={Position.Top} id={`${id}-btn5`} style={{ ...pinStyle, top: '28.0%', left: '57.0%', background: '#89b4fa' }} title="BTN5" />

    {/* --- DONJI KONEKTOR (GND) - 5 PINOVA --- */}
    <Handle type="source" position={Position.Bottom} id={`${id}-gnd-1`} style={{ ...pinStyle, bottom: '6.5%', left: '26.0%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Bottom} id={`${id}-gnd-2`} style={{ ...pinStyle, bottom: '6.5%', left: '30.8%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Bottom} id={`${id}-gnd-3`} style={{ ...pinStyle, bottom: '6.5%', left: '35.6%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Bottom} id={`${id}-gnd-4`} style={{ ...pinStyle, bottom: '6.5%', left: '40.4%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Bottom} id={`${id}-gnd-5`} style={{ ...pinStyle, bottom: '6.5%', left: '45.2%', background: '#000000' }} title="GND" />
  </div>
);

const NanoExtendedBoardNode = ({ id }) => (
  <div style={{ position: 'relative', width: '380px', height: '285px' }}>
    <img
      src={process.env.PUBLIC_URL + '/nanorazvojreal.jpg'}
      alt="Arduino Nano Extended Board"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '8px',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))',
      }}
    />

    {/* --- 1. POWER KONEKTOR (Gore levo) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-pwr-vcc`} style={{ ...pinStyle, top: '22%', left: '11%', background: '#ff0000' }} title="Power +5V" />
    <Handle type="source" position={Position.Top} id={`${id}-pwr-gnd`} style={{ ...pinStyle, top: '22%', left: '16%', background: '#000000' }} title="Power GND" />

    {/* --- 2. RGB LED KONEKTOR (Gore, sredina-levo) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-rgb-r`} style={{ ...pinStyle, top: '20.5%', left: '37.5%', background: '#ff0000' }} title="RGB Red" />
    <Handle type="source" position={Position.Top} id={`${id}-rgb-g`} style={{ ...pinStyle, top: '20.5%', left: '39.5%', background: '#00ff00' }} title="RGB Green" />
    <Handle type="source" position={Position.Top} id={`${id}-rgb-b`} style={{ ...pinStyle, top: '20.5%', left: '41.5%', background: '#0000ff' }} title="RGB Blue" />
    <Handle type="source" position={Position.Top} id={`${id}-rgb-gnd`} style={{ ...pinStyle, top: '20.5%', left: '43.5%', background: '#000000' }} title="RGB GND" />

    {/* --- 3. 6x LED KONEKTOR (Gore, sredina-desno) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-led1`} style={{ ...pinStyle, top: '22%', left: '51%', background: '#89b4fa' }} title="LED1" />
    <Handle type="source" position={Position.Top} id={`${id}-led2`} style={{ ...pinStyle, top: '22%', left: '53.5%', background: '#89b4fa' }} title="LED2" />
    <Handle type="source" position={Position.Top} id={`${id}-led3`} style={{ ...pinStyle, top: '22%', left: '56%', background: '#89b4fa' }} title="LED3" />
    <Handle type="source" position={Position.Top} id={`${id}-led4`} style={{ ...pinStyle, top: '22%', left: '58.5%', background: '#89b4fa' }} title="LED4" />
    <Handle type="source" position={Position.Top} id={`${id}-led5`} style={{ ...pinStyle, top: '22%', left: '61%', background: '#89b4fa' }} title="LED5" />
    <Handle type="source" position={Position.Top} id={`${id}-led6`} style={{ ...pinStyle, top: '22%', left: '63.5%', background: '#89b4fa' }} title="LED6" />

    {/* --- 4. 7-SEGMENTNI DISPLEJ KONEKTOR (Gore desno) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-7seg-a`} style={{ ...pinStyle, top: '26.5%', left: '76%', background: '#f9e2af' }} title="7Seg A" />
    <Handle type="source" position={Position.Top} id={`${id}-7seg-b`} style={{ ...pinStyle, top: '26.5%', left: '78.5%', background: '#f9e2af' }} title="7Seg B" />
    <Handle type="source" position={Position.Top} id={`${id}-7seg-c`} style={{ ...pinStyle, top: '26.5%', left: '81%', background: '#f9e2af' }} title="7Seg C" />
    <Handle type="source" position={Position.Top} id={`${id}-7seg-d`} style={{ ...pinStyle, top: '26.5%', left: '83.5%', background: '#f9e2af' }} title="7Seg D" />

    {/* --- 5. TASTER KONEKTOR / 5xBTN (Sredina) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-btn1`} style={{ ...pinStyle, top: '32%', left: '46.5%', background: '#cba6f7' }} title="BTN1" />
    <Handle type="source" position={Position.Top} id={`${id}-btn2`} style={{ ...pinStyle, top: '32%', left: '49%', background: '#cba6f7' }} title="BTN2" />
    <Handle type="source" position={Position.Top} id={`${id}-btn3`} style={{ ...pinStyle, top: '32%', left: '51.5%', background: '#cba6f7' }} title="BTN3" />

    {/* --- 6. POTENCIOMETRI KONEKTOR / POT (Sredina desno) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-pot1`} style={{ ...pinStyle, top: '46.5%', left: '76.5%', background: '#fab387' }} title="POT1" />
    <Handle type="source" position={Position.Top} id={`${id}-pot2`} style={{ ...pinStyle, top: '46.5%', left: '79%', background: '#fab387' }} title="POT2" />
    <Handle type="source" position={Position.Top} id={`${id}-pot3`} style={{ ...pinStyle, top: '46.5%', left: '81.5%', background: '#fab387' }} title="POT3" />

    {/* --- 7. LCD 16x2 KONEKTOR (Levo dole) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-lcd-vcc`} style={{ ...pinStyle, top: '61.5%', left: '9%', background: '#ff0000' }} title="LCD VCC" />
    <Handle type="source" position={Position.Top} id={`${id}-lcd-gnd`} style={{ ...pinStyle, top: '61.5%', left: '12%', background: '#000000' }} title="LCD GND" />
    <Handle type="source" position={Position.Top} id={`${id}-lcd-sda`} style={{ ...pinStyle, top: '61.5%', left: '15%', background: '#89b4fa' }} title="LCD SDA" />
    <Handle type="source" position={Position.Top} id={`${id}-lcd-scl`} style={{ ...pinStyle, top: '61.5%', left: '18%', background: '#89b4fa' }} title="LCD SCL" />

    {/* --- 8. DHT11 / SENZOR TEMPERATURE KONEKTOR (Sredina dole) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-dht-vcc`} style={{ ...pinStyle, top: '56.5%', left: '58.5%', background: '#ff0000' }} title="DHT VCC" />
    <Handle type="source" position={Position.Top} id={`${id}-dht-data`} style={{ ...pinStyle, top: '56.5%', left: '60.5%', background: '#89b4fa' }} title="DHT DATA" />
    <Handle type="source" position={Position.Top} id={`${id}-dht-gnd`} style={{ ...pinStyle, top: '56.5%', left: '62.5%', background: '#000000' }} title="DHT GND" />

    {/* --- 9. ULTRASONIČNI SENZOR KONEKTOR / ULTRASONIC (Dole desno) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-us-vcc`} style={{ ...pinStyle, top: '75%', left: '67.5%', background: '#ff0000' }} title="US VCC" />
    <Handle type="source" position={Position.Top} id={`${id}-us-trig`} style={{ ...pinStyle, top: '75%', left: '70%', background: '#89b4fa' }} title="US TRIG" />
    <Handle type="source" position={Position.Top} id={`${id}-us-echo`} style={{ ...pinStyle, top: '75%', left: '72.5%', background: '#89b4fa' }} title="US ECHO" />
    <Handle type="source" position={Position.Top} id={`${id}-us-gnd`} style={{ ...pinStyle, top: '75%', left: '75%', background: '#000000' }} title="US GND" />
  </div>
);

const ThreePotModuleNode = ({ id }) => (
  <div style={{ position: 'relative', width: '220px', height: '170px' }}>
    <img
      src={process.env.PUBLIC_URL + '/pots.png'}
      alt="3x Potentiometer Module"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '16px',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))',
      }}
    />

    {/* --- CRNI KONEKTOR H1 (Sleva na desno: GND, P1, P2, P3, +5V) --- */}
    <Handle type="source" position={Position.Bottom} id={`${id}-gnd`} style={{ ...pinStyle, bottom: '21%', left: '29.5%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Bottom} id={`${id}-p1`} style={{ ...pinStyle, bottom: '21%', left: '38.8%', background: '#f9e2af' }} title="P1 (Pot 1)" />
    <Handle type="source" position={Position.Bottom} id={`${id}-p2`} style={{ ...pinStyle, bottom: '21%', left: '48.1%', background: '#f9e2af' }} title="P2 (Pot 2)" />
    <Handle type="source" position={Position.Bottom} id={`${id}-p3`} style={{ ...pinStyle, bottom: '21%', left: '57.4%', background: '#f9e2af' }} title="P3 (Pot 3)" />
    <Handle type="source" position={Position.Bottom} id={`${id}-5v`} style={{ ...pinStyle, bottom: '21%', left: '66.7%', background: '#ff0000' }} title="+5V" />
  </div>
);



const FlameNode = ({ id }) => (
  <div style={{ position: 'relative', width: '220px', height: '80px' }}>
    <img
      src={process.env.PUBLIC_URL + '/flame-sensor.png'}
      alt="Senzor Plamena"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '18px',
        overflow: 'hidden',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))',
      }}
    />

    {/* DESNA STRANA: PINOVI (VCC, GND, DO, AO) */}
    <Handle
      type="source"
      position={Position.Right}
      id={`${id}-vcc`}
      style={{ ...pinStyle, top: '18px', right: '10px', background: '#ff0000' }}
      title="VCC (+5V)"
    />
    <Handle
      type="source"
      position={Position.Right}
      id={`${id}-gnd`}
      style={{ ...pinStyle, top: '32px', right: '10px', background: '#000000' }}
      title="GND"
    />
    <Handle
      type="source"
      position={Position.Right}
      id={`${id}-do`}
      style={{ ...pinStyle, top: '46px', right: '10px', background: '#89b4fa' }}
      title="DO (Digital Out)"
    />
    <Handle
      type="source"
      position={Position.Right}
      id={`${id}-ao`}
      style={{ ...pinStyle, top: '60px', right: '10px', background: '#f9e2af' }}
      title="AO (Analog Out)"
    />
  </div>
);

const Lcd1602Node = ({ id }) => (
  <div style={{ position: 'relative', width: '380px', height: '170px' }}>
    <img
      src={process.env.PUBLIC_URL + '/lcd.png'}
      alt="LCD 1602 Display"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '6px',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))',
      }}
    />

    {/* --- PIN SUPERIORI (Da sinistra a destra: 16 Pin) --- */}
    <Handle type="source" position={Position.Top} id={`${id}-gnd`} style={{ ...pinStyle, top: '1.5%', left: '8.2%', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Top} id={`${id}-vcc`} style={{ ...pinStyle, top: '1.5%', left: '11.4%', background: '#ff0000' }} title="VCC" />
    <Handle type="source" position={Position.Top} id={`${id}-v0`} style={{ ...pinStyle, top: '1.5%', left: '14.6%', background: '#cba6f7' }} title="V0 (Contrast)" />
    <Handle type="source" position={Position.Top} id={`${id}-rs`} style={{ ...pinStyle, top: '1.5%', left: '17.8%', background: '#89b4fa' }} title="RS" />
    <Handle type="source" position={Position.Top} id={`${id}-rw`} style={{ ...pinStyle, top: '1.5%', left: '21.0%', background: '#89b4fa' }} title="RW" />
    <Handle type="source" position={Position.Top} id={`${id}-e`} style={{ ...pinStyle, top: '1.5%', left: '24.2%', background: '#89b4fa' }} title="E (Enable)" />
    <Handle type="source" position={Position.Top} id={`${id}-db0`} style={{ ...pinStyle, top: '1.5%', left: '27.4%', background: '#f9e2af' }} title="DB0" />
    <Handle type="source" position={Position.Top} id={`${id}-db1`} style={{ ...pinStyle, top: '1.5%', left: '30.6%', background: '#f9e2af' }} title="DB1" />
    <Handle type="source" position={Position.Top} id={`${id}-db2`} style={{ ...pinStyle, top: '1.5%', left: '33.8%', background: '#f9e2af' }} title="DB2" />
    <Handle type="source" position={Position.Top} id={`${id}-db3`} style={{ ...pinStyle, top: '1.5%', left: '37.0%', background: '#f9e2af' }} title="DB3" />
    <Handle type="source" position={Position.Top} id={`${id}-db4`} style={{ ...pinStyle, top: '1.5%', left: '40.2%', background: '#f9e2af' }} title="DB4" />
    <Handle type="source" position={Position.Top} id={`${id}-db5`} style={{ ...pinStyle, top: '1.5%', left: '43.4%', background: '#f9e2af' }} title="DB5" />
    <Handle type="source" position={Position.Top} id={`${id}-db6`} style={{ ...pinStyle, top: '1.5%', left: '46.6%', background: '#f9e2af' }} title="DB6" />
    <Handle type="source" position={Position.Top} id={`${id}-db7`} style={{ ...pinStyle, top: '1.5%', left: '49.8%', background: '#f9e2af' }} title="DB7" />
    <Handle type="source" position={Position.Top} id={`${id}-led-a`} style={{ ...pinStyle, top: '1.5%', left: '53.0%', background: '#ff0000' }} title="LED+ (Anode)" />
    <Handle type="source" position={Position.Top} id={`${id}-led-k`} style={{ ...pinStyle, top: '1.5%', left: '56.2%', background: '#000000' }} title="LED- (Cathode)" />
  </div>
);

const RelayNode = ({ id }) => (
  <div style={{ position: 'relative', width: '220px', height: '80px' }}>
    <img
      src={process.env.PUBLIC_URL + '/relej.png'}
      alt="Relej 5V"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '16px', // <--- DODATO: Podešava koliko su uglovi zaobljeni (npr. 8px ili 12px)
        overflow: 'hidden',
        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))',
      }}
    />

    {/* LEVI PINOVI: VCC, GND, IN */}
    <Handle type="source" position={Position.Left} id={`${id}-vcc`} style={{ ...pinStyle, top: '27px', left: '18px', background: '#ff0000' }} title="VCC (+5V)" />
    <Handle type="source" position={Position.Left} id={`${id}-gnd`} style={{ ...pinStyle, top: '41px', left: '18px', background: '#000000' }} title="GND" />
    <Handle type="source" position={Position.Left} id={`${id}-in`} style={{ ...pinStyle, top: '55px', left: '18px', background: '#89b4fa' }} title="IN (Signal)" />

    {/* DESNI PINOVI: NO, COM, NC */}
    <Handle type="source" position={Position.Right} id={`${id}-no`} style={{ ...pinStyle, top: '14px', right: '28px', background: '#f9e2af' }} title="NO" />
    <Handle type="source" position={Position.Right} id={`${id}-com`} style={{ ...pinStyle, top: '40px', right: '28px', background: '#fab387' }} title="COM" />
    <Handle type="source" position={Position.Right} id={`${id}-nc`} style={{ ...pinStyle, top: '66px', right: '28px', background: '#f9e2af' }} title="NC" />
  </div>
);

const MotorNode = ({ id }) => (
  <div style={{ width: '160px', background: '#334155', border: '2px solid #94a3b8', borderRadius: '8px', padding: '10px', color: '#fff', position: 'relative' }}>
    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', color: '#cbd5e1', marginBottom: '6px' }}>🔒 MOTOR BRAVE (12V)</div>
    <div style={{ width: '100%', height: '30px', background: '#1e293b', border: '1px solid #475569', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '18px' }}>🚘</span>
      <span style={{ fontSize: '9px', color: '#94a3b8', marginLeft: '6px' }}>Door Actuator</span>
    </div>
    <div style={{ position: 'relative', height: '55px', background: '#0f172a', borderRadius: '6px' }}>
      <Handle type="source" position={Position.Left} id={`${id}-pos`} style={{ ...pinStyle, top: '15px', left: '4px', background: '#ff0000' }} />
      <span style={{ position: 'absolute', left: '16px', top: '12px', fontSize: '10px', color: '#fca5a5' }}>+ (12V Trigger)</span>
      <Handle type="source" position={Position.Left} id={`${id}-neg`} style={{ ...pinStyle, top: '35px', left: '4px', background: '#000000' }} />
      <span style={{ position: 'absolute', left: '16px', top: '32px', fontSize: '10px', color: '#cbd5e1' }}>- (GND)</span>
    </div>
  </div>
);

const nodeTypes = {
  esp32Node: ESP32Node,
  nanoNode: ArduinoNanoNode,
  nanoBoardNode: NanoExtendedBoardNode,
  nanoPinsNode: NanoExtendedPinsNode,
  unoNode: ArduinoUnoNode,
  ledArrayNode: LedArrayNode,
  sevenSegmentNode: SevenSegmentNode,
  buttonsModuleNode: ButtonsModuleNode,
  mq2Node: MQ2Node,
  flameNode: FlameNode,
  lcdNode: Lcd1602Node,
  potsNode: ThreePotModuleNode,
  relayNode: RelayNode,
  motorNode: MotorNode,
  ledNode: LedNode,
};

const WIRE_COLORS = [
  { name: 'Crvena (+12V/5V)', color: '#ff0000' },
  { name: 'Crna (GND)', color: '#000000' },
  { name: 'Žuta (Dim Signal)', color: '#ffd700' },
  { name: 'Zelena (Plamen)', color: '#00ff00' },
  { name: 'Plava (Shunt)', color: '#1e90ff' },
  { name: 'Narandžasta (Motor Signal)', color: '#ff8c00' },
  { name: 'Ljubičasta (12V Power)', color: '#9932cc' },
];

let idCounter = 0;
const getId = () => `node_${idCounter++}`;

export default function App() {
  const reactFlowWrapper = useRef(null);
  const fileInputRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedColor, setSelectedColor] = useState(WIRE_COLORS[0].color);

 const onConnect = useCallback(
  (params) =>
    setEdges((eds) => {
      // Izračunavamo offset tako da svaka nova žica ima drugačiju odmaknutost
      const offsetValue = 15 + eds.length * 12; 

      return addEdge(
        {
          ...params,
          type: 'smoothstep',
          pathOptions: {
            borderRadius: 10 + (eds.length % 5) * 4,
            offset: offsetValue,
          },
          style: { strokeWidth: 3, stroke: selectedColor }, // Tvoja izabrana boja žice
        },
        eds
      );
    }),
  [setEdges, selectedColor]
);
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const exportImage = () => {
    if (reactFlowWrapper.current === null) return;
    toPng(reactFlowWrapper.current, { cacheBust: true })
      .then((dataUrl) => {
        download(dataUrl, 'sema_povezivanja.png');
      })
      .catch((err) => console.error(err));
  };

  const saveProject = () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      download(JSON.stringify(flow, null, 2), 'projekat_sema.json', 'application/json');
    }
  };

  const loadProject = (event) => {
    const fileReader = new FileReader();
    if (event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        const flow = JSON.parse(e.target.result);
        if (flow) {
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
        }
      };
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#f8f9fa' }}>
      <ReactFlowProvider>
        <aside style={sidebarStyle}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#60a5fa' }}>🛠️ Komponente</h3>
          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'esp32Node')} draggable style={itemStyle}>
            📟 ESP32 NodeMCU
          </div>
          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'nanoNode')} draggable style={itemStyle}>
          🔷 Arduino Nano
          </div>
          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'unoNode')} draggable style={itemStyle}>
          🟦 Arduino Uno
          </div>
          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'nanoBoardNode')} draggable style={itemStyle}>
          🎛️ Nano Razvojna Pločica
          </div>
          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'ledArrayNode')} draggable style={itemStyle}>
          🚨 Modul 6 LED Dioda
          </div>
          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'nanoPinsNode')} draggable style={itemStyle}>
          🔹 Nano Extended
          </div>
          
          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'buttonsModuleNode')} draggable style={itemStyle}>
          🔘 Modul sa 5 Tastera
          </div>

          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'lcdNode')} draggable style={itemStyle}>
          🖥️ LCD 16x2 Display
          </div>

          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'potsNode')} draggable style={itemStyle}>
          🎛️ Modul 3 Potenciometra
          </div>

          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'mq2Node')} draggable style={itemStyle}>
           ➔ MQ-2 Senzor Dima
          </div>
          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'flameNode')} draggable style={itemStyle}>
          🔥 Senzor Plamena
          </div>
          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'sevenSegmentNode')} draggable style={itemStyle}>
          🔢 7-Segmentni Displej
          </div>


          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'relayNode')} draggable style={itemStyle}>
          ⚡ Relej Modul (5V)
          </div>
          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'motorNode')} draggable style={itemStyle}>
            🔒 Motor Brave (12V)
          </div>
          <div onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'ledNode')} draggable style={itemStyle}>
            💡 LED Dioda (Crvena)
          </div>

          <hr style={{ borderColor: '#334155', margin: '15px 0' }} />

          <button onClick={exportImage} style={btnStyle}>📷 Izvezi Sliku</button>
          <button onClick={saveProject} style={{ ...btnStyle, background: '#4ade80', color: '#0f172a' }}>💾 Sačuvaj JSON</button>
          <button onClick={() => fileInputRef.current.click()} style={{ ...btnStyle, background: '#fde047', color: '#0f172a' }}>📂 Učitaj JSON</button>
          <input type="file" ref={fileInputRef} onChange={loadProject} style={{ display: 'none' }} accept=".json" />
        </aside>

        <div style={{ flexGrow: 1, position: 'relative' }} ref={reactFlowWrapper}>
          <div style={toolbarStyle}>
            <strong>Boja žice:</strong>
            {WIRE_COLORS.map((item) => (
              <button
                key={item.color}
                onClick={() => setSelectedColor(item.color)}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: item.color,
                  border: selectedColor === item.color ? '3px solid #fff' : '1px solid #64748b',
                  cursor: 'pointer',
                }}
                title={item.name}
              />
            ))}
          </div>


          <style>{`
  .react-flow__edges, .react-flow__edgelayer {
    z-index: 1000 !important;
  }
  .react-flow__edges svg {
    z-index: 1000 !important;
    overflow: visible !important;
    pointer-events: none !important;
  }
  .react-flow__edge-path, .react-flow__edge-interaction {
    pointer-events: all !important;
  }
  .react-flow__nodes, .react-flow__node {
    z-index: 1 !important;
  }
`}</style>


          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            connectionMode="loose"
            elevatedEdges={true}
            connectionLineStyle={{ stroke: selectedColor, strokeWidth: 4 }}
            defaultEdgeOptions={{
             type: 'smoothstep', // Postavlja zaobljene trajektorije sa pravim uglovima
              animated: false,
               pathOptions: {
                borderRadius: 12, // Blago zaobljeni uglovi
                 offset: 60,       // Veća udaljenost/rastojanje između paralelnih linija
               },
            style: { strokeWidth: 3 }, // Debljina žice
            }}


            deleteKeyCode={['Backspace', 'Delete']}
            fitView
          >
            <Background color="#334155" gap={20} size={1} />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}

const sidebarStyle = {
  width: '220px',
  background: '#1e293b',
  padding: '15px',
  borderRight: '1px solid #334155',
  color: '#f8fafc',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const itemStyle = {
  padding: '12px',
  background: '#0f172a',
  borderRadius: '8px',
  cursor: 'grab',
  border: '1px solid #334155',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '12px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
};

const btnStyle = {
  padding: '10px',
  borderRadius: '6px',
  border: 'none',
  background: '#3b82f6',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const toolbarStyle = {
  position: 'absolute',
  top: 15,
  left: 15,
  zIndex: 10,
  background: '#1e293b',
  padding: '8px 15px',
  borderRadius: '8px',
  border: '1px solid #334155',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#f8fafc',
  fontSize: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
};