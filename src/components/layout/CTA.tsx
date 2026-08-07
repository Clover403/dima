import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  navy: "#030035",
  bronze: "#E5997B",
  gray: "#F4F4F5",
};

const fontFace = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter+Tight:wght@300;400;500;600&display=swap');
  .font-display { font-family: 'Playfair Display', serif; }
  .font-body { font-family: 'Inter Tight', sans-serif; }
`;

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

export default function CTA({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isLight = theme === "light";
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactName: "",
    email: "",
    productType: "",
    phone: "",
    position: "",
    sector: "",
  });
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [showError, setShowError] = useState(false);

  const isEmailValid = validateEmail(formData.email);
  const isPhoneValid = formData.phone.replace(/[\s+\-()]/g, '').length >= 8;

  const isFormValid = !!(
    formData.contactName &&
    formData.position &&
    formData.sector &&
    formData.productType &&
    isEmailValid &&
    isPhoneValid
  );

  useEffect(() => {
    if (isFormValid) {
      setShowError(false);
    }
  }, [isFormValid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((p) => ({ ...p, email: val }));
    if (val && !validateEmail(val)) {
      setErrors((p) => ({ ...p, email: 'Ingrese un correo electrónico válido' }));
    } else {
      setErrors((p) => ({ ...p, email: undefined }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[a-zA-Z]/g, '');
    setFormData((p) => ({ ...p, phone: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      navigate('/contacto', { state: formData });
    } else {
      setShowError(true);
    }
  };

  const labelStyle = 'block font-body text-[11px] sm:text-xs md:text-sm font-bold text-[#030035]/80 mb-1.5 sm:mb-2 pl-2';
  const capsuleInput = `w-full px-4 sm:px-5 py-3 sm:py-3.5 ${isLight ? 'bg-[#F4F4F5]' : 'bg-white'} border border-[#030035]/10 rounded-full text-[#030035] font-normal text-sm focus:outline-none focus:border-[#E5997B] focus:ring-1 focus:ring-[#E5997B]/50 transition-all duration-300 shadow-sm placeholder:text-[#030035]/40 placeholder:font-light`;
  const validNote = 'mt-1.5 pl-3 font-body text-[10px] sm:text-xs text-[#E5997B]';
  const errorNote = 'mt-1.5 pl-3 font-body text-[10px] sm:text-xs text-red-500';

  // Daftar poin dipisah agar bisa dipakai 2 kali (Desktop & Mobile)
  const featuresList = [
    "Diagnóstico inicial sin compromiso",
    "Evaluación preliminar de viabilidad",
    "Sesión directa con nuestro equipo",
  ];

  return (
    <section
      className="w-full font-body relative overflow-hidden min-h-screen flex flex-col justify-center py-12 lg:py-20"
      style={{
        background: isLight ? COLORS.gray : COLORS.navy,
        color: isLight ? COLORS.navy : COLORS.gray,
      }}
    >
      <style>{fontFace}</style>

      <div className="w-[90%] md:w-[85%] max-w-[1200px] mx-auto relative z-10">
        
        {/* HEADER: Centered di semua device */}
        <div className="mb-8 md:mb-16 text-center">
          <p
            className="text-[10px] md:text-xs tracking-[0.25em] uppercase font-bold mb-3 md:mb-4"
            style={{ color: COLORS.bronze }}
          >
            Get in touch
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] md:leading-[1.15] tracking-tight font-medium w-full mx-auto font-display"
            style={{ color: isLight ? COLORS.navy : COLORS.gray }}
          >
            Hablemos de su{' '}
            <span className="font-display block sm:inline" style={{ color: COLORS.bronze }}>próximo paso.</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-stretch gap-8 md:gap-14 lg:gap-16 xl:gap-24 w-full">
          
          {/* KOLOM KIRI */}
          <div className="flex-1 w-full max-w-xl flex flex-col h-full text-center lg:text-left">
            
            {/* DESKRIPSI: Centered di Mobile/Tab, Kiri di Desktop */}
            <p
              className="text-base sm:text-lg lg:text-xl font-normal mb-8 leading-relaxed opacity-90 mx-auto lg:mx-0 max-w-lg lg:max-w-none"
              style={{ color: isLight ? COLORS.navy : COLORS.gray }}
            >
              Comience completando algunos datos básicos. Con base en su información,
              le daremos acceso directo a nuestro calendario para agendar una sesión
              con nuestro equipo de ingeniería financiera.
            </p>

            {/* POIN 3: HANYA TAMPIL DI DESKTOP */}
            <div className="hidden lg:block pl-5 border-l-4 mb-12" style={{ borderColor: COLORS.bronze }}>
              {featuresList.map((item) => (
                <div key={item} className="flex items-center gap-3 py-2.5">
                  <span className="w-2 h-2 rounded-full flex-none" style={{ background: COLORS.bronze }} />
                  <span className="text-base font-medium opacity-90" style={{ color: isLight ? COLORS.navy : COLORS.gray }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* ILUSTRASI */}
            <div className="mt-2 lg:mt-auto pt-4 flex justify-center lg:justify-start">
              <img 
                src={isLight ? "/logo/orange_black.svg" : "/logo/orange_white.svg"} 
                alt="Invoice Illustration" 
                className="w-1/2 lg:w-full max-w-[200px] lg:max-w-[320px] object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>

          {/* KOLOM KANAN (FORM & POIN MOBILE) */}
          <div className="w-full max-w-lg mx-auto lg:mx-0 lg:max-w-lg flex flex-col">
            
            <form
              onSubmit={handleSubmit}
              noValidate
              className={`w-full p-6 sm:p-8 md:p-10 ${
                isLight 
                  ? 'bg-white border-[#030035]/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]' 
                  : 'bg-[#F4F4F5]/[0.98] border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.4)]'
              } border rounded-2xl md:rounded-3xl relative backdrop-blur-sm`}
            >
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className={labelStyle}>Nombre de Contacto *</label>
                    <input 
                      type="text" 
                      name="contactName" 
                      value={formData.contactName} 
                      onChange={handleChange} 
                      placeholder="Ej. Alejandro Magno" 
                      className={capsuleInput} 
                      required 
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Cargo *</label>
                    <input 
                      type="text" 
                      name="position" 
                      value={formData.position} 
                      onChange={handleChange} 
                      placeholder="Ej. Director General" 
                      className={capsuleInput} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className={labelStyle}>Email Corporativo *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleEmailChange} 
                      placeholder="nombre@empresa.com" 
                      className={`${capsuleInput} ${
                        errors.email ? 'border-red-500 focus:border-red-500' 
                        : formData.email && isEmailValid ? 'border-[#E5997B]' 
                        : ''
                      }`} 
                      required 
                    />
                    {errors.email && <p className={errorNote}>{errors.email}</p>}
                    {formData.email && isEmailValid && !errors.email && <p className={validNote}>✓ Válido</p>}
                  </div>
                  <div>
                    <label className={labelStyle}>Teléfono *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handlePhoneChange} 
                      placeholder="+52 55 0000 0000" 
                      inputMode="tel"
                      className={`${capsuleInput} ${
                        formData.phone && isPhoneValid ? 'border-[#E5997B]' : ''
                      }`} 
                      required 
                    />
                    {formData.phone && !isPhoneValid && (
                      <p className="mt-1.5 pl-3 font-body text-[10px] sm:text-xs text-[#030035]/60">Mínimo 8 dígitos</p>
                    )}
                    {formData.phone && isPhoneValid && <p className={validNote}>✓ Válido</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className={labelStyle}>Sector / Industria *</label>
                    <input 
                      type="text" 
                      name="sector" 
                      value={formData.sector} 
                      onChange={handleChange} 
                      placeholder="Ej. Manufactura" 
                      className={capsuleInput} 
                      required 
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Tipo de Producto *</label>
                    <div className="relative">
                      <select 
                        name="productType" 
                        value={formData.productType} 
                        onChange={handleChange} 
                        className={`${capsuleInput} appearance-none cursor-pointer pr-10`} 
                        required
                      >
                        <option value="" disabled className="bg-white text-[#030035]/50">Seleccione opciones</option>
                        <option value="Crédito Simple" className="bg-white text-[#030035]">Crédito Simple</option>
                        <option value="Crédito Puente" className="bg-white text-[#030035]">Crédito Puente</option>
                        <option value="Cuenta Corriente" className="bg-white text-[#030035]">Cuenta Corriente</option>
                        <option value="Crédito Agroindustrial" className="bg-white text-[#030035]">Crédito Agroindustrial</option>
                        <option value="Arrendamiento Financiero" className="bg-white text-[#030035]">Arrendamiento Financiero</option>
                        <option value="Factoring" className="bg-white text-[#030035]">Factoring</option>
                        <option value="Por definir" className="bg-white text-[#030035]">Por definir / TBD</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#030035]/50">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-8 sm:mt-10 inline-flex items-center justify-center gap-3 px-6 py-3.5 sm:py-4 font-body font-bold text-xs sm:text-sm tracking-[0.15em] sm:tracking-widest uppercase transition-all duration-300 rounded-full bg-[#E5997B] text-[#030035] cursor-pointer hover:bg-[#030035] hover:text-[#F4F4F5] hover:shadow-[0_10px_30px_rgba(3,0,53,0.15)] transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Continuar / Lanjut</span>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {showError && (
                <div className="mt-4 text-center">
                  <p className="font-body text-[11px] sm:text-xs font-semibold text-red-500 animate-pulse">
                    * Faltan datos por completar
                  </p>
                </div>
              )}
            </form>

            {/* POIN 3: HANYA TAMPIL DI MOBILE & TAB (DI BAWAH FORM) */}
            <div className="block lg:hidden w-full mt-8 pt-6 border-t border-[#030035]/10 sm:border-none sm:pt-0 sm:mt-8">
              <div className="pl-4 sm:pl-5 border-l-2 sm:border-l-4 mx-auto max-w-sm text-left" style={{ borderColor: COLORS.bronze }}>
                {featuresList.map((item) => (
                  <div key={item} className="flex items-center gap-3 py-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-none" style={{ background: COLORS.bronze }} />
                    <span className="text-sm sm:text-base font-medium opacity-90" style={{ color: isLight ? COLORS.navy : COLORS.gray }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}