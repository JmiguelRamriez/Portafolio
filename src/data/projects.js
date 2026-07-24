const base = import.meta.env.BASE_URL || '/'

const projects = [
  {
    titulo: "Industrial SBC with Allwinner V3s",
    featured: true,
    categoria: "hardware",
    brief: "4-layer SBC designed in KiCad with Allwinner V3s ARM Cortex-A7, PMIC, Ethernet PHY, and USB 2.0 HS routing.",
    descripcion: "4-layer Single Board Computer designed in KiCad around the Allwinner V3s processor (ARM Cortex-A7), featuring EA3036CQB PMIC, Ethernet PHY, and integrated RTC. Includes differential pair routing with controlled impedance for USB 2.0 High-Speed and layout optimized for automated SMT manufacturing.",
    stack: ["KiCad", "Allwinner V3s", "Embedded Linux", "PCB Design"],
    url: "https://github.com/JmiguelRamriez/Custom-Linux-Single-Board-Computer",
    imagenes: [`${base}images/PCB_allwinner.png`, `${base}images/PCB_diseno.png`]
  },
  {
    titulo: "valeo-peps — Automated Positioning System for PEPS Validation",
    featured: true,
    categoria: "hardware",
    badge: "Industry Collaboration",
    brief: "Automated positioning system for automotive PEPS validation. CoreXY platform with C++ firmware, ultrasonic calibration, and Python GUI.",
    descripcion: "Automated positioning system for automotive PEPS (Passive Entry Passive Start) validation, designed and implemented by a team of 9 engineers. Kinematics based on CoreXY topology with two NEMA17 stepper motors (1.8°/step, 16× microstepping) achieving 0.024 mm/step resolution and up to 160 mm/s traverse speed via GT2 belt and pulley drive. C++ firmware implements non-blocking stepper control with trapezoidal acceleration profiles. Autonomous calibration system uses 4 HC-SR04 ultrasonic sensors arranged in opposing pairs with reflecting surfaces on the carriage — X1/X2 measure Y-axis position against an angled reflector wall, Y1/Y2 measure X-axis position against the key fob basket — achieving ±1 cm accuracy over a 400×1310 mm test area. Python/Tkinter GUI features interactive coordinate map, real-time position tracking, programmable multi-step sequences with EEPROM persistence, configurable quick positions, and emergency stop. Serial protocol (115200 baud) exposes 14+ commands including PING, MOVE, CALIBRATE, SEQUENCE, SPEED, SET_ORIGIN, ESTOP, and SENSORS for external automation. Structure elevated on 1\" support rods to preserve desk space.",
    stack: ["C++", "Python", "Tkinter", "Arduino", "CoreXY", "NEMA17"],
    url: "https://github.com/JmiguelRamriez/valeo-peps",
    document: `${base}files/Manual_CoreXY_PEPS.pdf`,
    imagenes: [`${base}images/Peps.png`, `${base}images/valeo.png`]
  },
  {
    titulo: "Luna — AI Voice Assistant",
    categoria: "hardware",
    brief: "Voice assistant on custom PCB with ESP32, I2S mic, OLED display, and Groq API for low-latency AI responses.",
    descripcion: "Voice assistant embedded in a custom PCB designed in KiCad, with ESP32, I2S INMP441 microphone, PAM8403 amplifier, and SH1106 OLED display. Processes audio with wake-word detection (VAD) and uses Groq API (Whisper + LLaMA 3.1) via Flask backend for low-latency responses.",
    stack: ["ESP32", "MicroPython", "KiCad", "Groq API", "Flask"],
    url: "https://github.com/JmiguelRamriez/esp32-ai-assistant",
    imagenes: [`${base}images/PCB_luna.png`, `${base}images/PCB_lunaDiseno.png`]
  },
  {
    titulo: "DetectaGas — IoT Gas Leak Prevention System",
    featured: true,
    categoria: "hardware",
    brief: "IoT gas leak detection with ESP32, MQ-5 sensor, Rust/Axum backend, and real-time MQTT telemetry.",
    descripcion: "Full-stack IoT system for LP gas leak prevention. Hardware layer uses ESP32 with MQ-5 sensor (300 ppm threshold), dual LED indicators, and piezo buzzer for local alarm. Firmware in MicroPython publishes readings via MQTT (Mosquitto broker) to a custom backend in Rust/Axum with MySQL persistence and WebSocket real-time relay. React frontend displays live telemetry, interactive charts, and push alerts. Achieves sub-second latency from detection to notification. REST API endpoints for historical data export. System powered by 4× AA batteries for standalone operation.",
    stack: ["ESP32", "Rust", "Axum", "React", "MQTT", "MySQL"],
    url: "https://github.com/JmiguelRamriez/DetectaGas",
    document: `${base}files/Documentacion_IoT.pdf`,
    imagenes: [`${base}images/detecta.jpeg`, `${base}images/iot.png`]
  },
  {
    titulo: "FINSIGHTS",
    categoria: "software",
    brief: "Full-stack finance dashboard with Next.js, FastAPI, and AI-powered insights via Google Gemini. Built at HackMTY 2025.",
    descripcion: "Full-stack personal finance dashboard developed for Capital One HackMTY 2025. Features transaction visualization, income/expense tracking, and AI-powered financial insights via Google Gemini API. Built with Next.js frontend and FastAPI microservices architecture.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Python", "Google Gemini", "Tailwind CSS"],
    url: "https://github.com/JmiguelRamriez/HackMTY-2025",
    imagenes: [`${base}images/dashboard.jpg`]
  },
  {
    titulo: "FinTracker",
    featured: true,
    categoria: "software",
    brief: "Python desktop app for personal financial management with modular architecture and Tkinter GUI.",
    descripcion: "Python desktop application for personal financial management. Modular architecture with separate layers for core logic, data persistence, and user interface built with Tkinter.",
    stack: ["Python", "Tkinter", "Pandas"],
    url: "https://github.com/JmiguelRamriez/Control-financiero",
    imagenes: [`${base}images/finances.png`]
  },
  {
    titulo: "Commercial Flight Data Analysis",
    categoria: "data",
    brief: "Python pipeline for cleaning and analyzing commercial flight datasets with trend analysis.",
    descripcion: "Python pipeline for cleaning and processing commercial flight datasets, with modular scripts that significantly reduce preprocessing time for trend analysis.",
    stack: ["Python", "Pandas", "Data Analysis"],
    url: "https://github.com/JmiguelRamriez/flight_monitor",
    imagenes: [`${base}images/Flight.png`]
  },
  {
    titulo: "Nueva Tenochtitlan — Visual Novel Engine",
    categoria: "software",
    brief: "Interactive visual novel with dynamic dialogue branching, multiple endings, and save/load system.",
    descripcion: "Interactive visual novel with dynamic dialogue branching, character management, and multiple endings. Built in Python with a custom narrative engine featuring save/load and scene transitions. Final project for an elective course.",
    stack: ["Python", "OOP", "Game Development"],
    url: "https://github.com/JmiguelRamriez/Juego-Optativa",
    imagenes: [`${base}images/juego.png`, `${base}images/Juego_menu.png`]
  },
  {
    titulo: "Punto de Vista — University News Platform",
    categoria: "software",
    brief: "News platform covering university events with editorial layout and accessible content presentation.",
    descripcion: "News website covering university events and faculty stories, featuring a dedicated article about professor Spoturno's contributions to the academic community. Editorial layout with accessible content presentation.",
    stack: ["HTML", "CSS", "JavaScript", "Web Design"],
    url: "https://github.com/JmiguelRamriez/Punto-de-Vista-",
    imagenes: [`${base}images/Punto_Vista.png`]
  },
]
export default projects
