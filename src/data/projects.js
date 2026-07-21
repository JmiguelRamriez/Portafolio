const projects = [
  {
    titulo: "Industrial SBC with Allwinner V3s",
    categoria: "hardware",
    descripcion: "4-layer Single Board Computer designed in KiCad around the Allwinner V3s processor (ARM Cortex-A7), featuring EA3036CQB PMIC, Ethernet PHY, and integrated RTC. Includes differential pair routing with controlled impedance for USB 2.0 High-Speed and layout optimized for automated SMT manufacturing.",
    stack: ["KiCad", "Allwinner V3s", "Embedded Linux", "PCB Design"],
    url: "https://github.com/JmiguelRamriez/Custom-Linux-Single-Board-Computer",
    imagenes: ["images/PCB_allwinner.png", "images/PCB_diseno.png"]
  },
  {
    titulo: "valeo-peps — Automated Positioning System for PEPS Validation",
    categoria: "hardware",
    descripcion: "CoreXY platform for validating passive access systems (PEPS) in automotive. Firmware in C++ with non-blocking motor control and trapezoidal acceleration profiles, autonomous calibration with 4 HC-SR04 ultrasonic sensors (±1 cm accuracy in 390×1300 mm area), and Python/Tkinter GUI with real-time control and emergency stop.",
    stack: ["C++", "Python", "Tkinter", "Arduino", "CoreXY"],
    url: "https://github.com/JmiguelRamriez/valeo-peps",
    imagenes: ["images/Peps.png"]
  },
  {
    titulo: "Luna — AI Voice Assistant",
    categoria: "hardware",
    descripcion: "Voice assistant embedded in a custom PCB designed in KiCad, with ESP32, I2S INMP441 microphone, PAM8403 amplifier, and SH1106 OLED display. Processes audio with wake-word detection (VAD) and uses Groq API (Whisper + LLaMA 3.1) via Flask backend for low-latency responses.",
    stack: ["ESP32", "MicroPython", "KiCad", "Groq API", "Flask"],
    url: "https://github.com/JmiguelRamriez/esp32-ai-assistant",
    imagenes: ["images/PCB_luna.png", "images/PCB_lunaDiseno.png"]
  },
  {
    titulo: "DetectaGas — IoT Gas Leak Prevention System",
    categoria: "hardware",
    descripcion: "IoT device with ESP32 and MQ-5 sensor for early LP gas leak detection. Concurrent backend in Rust with Axum and React frontend, with real-time telemetry via MQTT broker.",
    stack: ["ESP32", "Rust", "Axum", "React", "MQTT"],
    url: "https://github.com/JmiguelRamriez/DetectaGas"
  },
  {
    titulo: "FINSIGHTS",
    categoria: "software",
    descripcion: "Full-stack personal finance dashboard developed for Capital One HackMTY 2025. Features transaction visualization, income/expense tracking, and AI-powered financial insights via Google Gemini API. Built with Next.js frontend and FastAPI microservices architecture.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Python", "Google Gemini", "Tailwind CSS"],
    url: "https://github.com/JmiguelRamriez/HackMTY-2025",
    imagenes: ["images/dashboard.jpg"]
  },
  {
    titulo: "FinTracker",
    categoria: "software",
    descripcion: "Python desktop application for personal financial management. Modular architecture with separate layers for core logic, data persistence, and user interface built with Tkinter.",
    stack: ["Python", "Tkinter", "Pandas"],
    url: "https://github.com/JmiguelRamriez/Control-financiero",
    imagenes: ["images/finances.png"]
  },
  {
    titulo: "Commercial Flight Data Analysis",
    categoria: "data",
    descripcion: "Python pipeline for cleaning and processing commercial flight datasets, with modular scripts that significantly reduce preprocessing time for trend analysis.",
    stack: ["Python", "Pandas", "Data Analysis"],
    url: "https://github.com/JmiguelRamriez/flight_monitor",
    imagenes: ["images/Flight.png"]
  },
]
export default projects
