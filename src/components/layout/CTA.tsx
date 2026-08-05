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

  // Penyesuaian Style (Dikecilkan)
  const labelStyle = 'block font-body text-xs md:text-sm font-bold text-[#030035]/80 mb-2 pl-2';
  const capsuleInput = `w-full px-4 py-2.5 ${isLight ? 'bg-[#F4F4F5]' : 'bg-white'} border border-[#030035]/10 rounded-full text-[#030035] font-normal text-sm md:text-base focus:outline-none focus:border-[#E5997B] focus:ring-1 focus:ring-[#E5997B]/50 transition-all duration-300 shadow-sm placeholder:text-[#030035]/40 placeholder:font-light`;
  const validNote = 'mt-1.5 pl-3 font-body text-xs text-[#E5997B]';
  const errorNote = 'mt-1.5 pl-3 font-body text-xs text-red-500';

  return (
    <section
      className="w-full font-body relative overflow-hidden min-h-screen flex flex-col justify-center"
      style={{
        background: isLight ? COLORS.gray : COLORS.navy,
        color: isLight ? COLORS.navy : COLORS.gray,
      }}
    >
      <style>{fontFace}</style>

      {/* Kontainer diperkecil max-width dan padding-nya */}
      <div className="w-[92%] max-w-[1400px] mx-auto py-16 relative z-10">
        
        <div className="mb-12 md:mb-16 text-center">
          <p
            className="text-[10px] md:text-xs tracking-[0.25em] uppercase font-bold mb-4"
            style={{ color: COLORS.bronze }}
          >
            Get in touch
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight font-medium w-full mx-auto font-display"
            style={{ color: isLight ? COLORS.navy : COLORS.gray }}
          >
            Hablemos de su{' '}
            <span className="font-display" style={{ color: COLORS.bronze }}>próximo paso.</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 xl:gap-24 w-full">
          
          <div className="flex-1 max-w-xl flex flex-col h-full">
            <p
              className="text-lg lg:text-xl font-normal mb-8 leading-relaxed"
              style={{ color: isLight ? COLORS.navy : COLORS.gray }}
            >
              Comience completando algunos datos básicos. Con base en su información,
              le daremos acceso directo a nuestro calendario para agendar una sesión
              con nuestro equipo de ingeniería financiera.
            </p>

            <div className="pl-5 border-l-4 mb-12" style={{ borderColor: COLORS.bronze }}>
              {[
                "Diagnóstico inicial sin compromiso",
                "Evaluación preliminar de viabilidad",
                "Sesión directa con nuestro equipo",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 py-2.5"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-none"
                    style={{ background: COLORS.bronze }}
                  />
                  <span className="text-sm lg:text-base font-medium" style={{ color: isLight ? COLORS.navy : COLORS.gray }}>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4">
              <img 
                src={isLight ? "/logo/orange_black.svg" : "/logo/orange_white.svg"} 
                alt="Invoice Illustration" 
                className="w-full max-w-sm object-contain"
              />
            </div>
          </div>

          {/* Form wrapper diperkecil padding & max-width */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className={`w-full max-w-lg p-8 md:p-10 ${isLight ? 'bg-white border-[#030035]/10 shadow-[0_0_50px_rgba(0,0,0,0.05)]' : 'bg-[#E5E7EB] border-white/50 shadow-[0_0_50px_rgba(0,0,0,0.4)]'} border rounded-2xl relative`}
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    <p className="mt-1.5 pl-3 font-body text-xs text-[#030035]/70">Mínimo 8 dígitos</p>
                  )}
                  {formData.phone && isPhoneValid && <p className={validNote}>✓ Válido</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Padding tombol dikurangi */}
            <button
              type="submit"
              className="w-full mt-8 inline-flex items-center justify-center gap-3 px-6 py-3.5 font-body font-bold text-sm tracking-widest uppercase transition-all duration-300 rounded-full bg-[#E5997B] text-[#030035] cursor-pointer hover:bg-white hover:shadow-[0_0_30px_rgba(229,153,123,0.5)] transform hover:-translate-y-0.5"
            >
              <span>Continuar / Lanjut</span>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {showError && (
              <div className="mt-4 text-center">
                <p className="font-body text-xs font-semibold text-red-500 animate-pulse">
                  * Faltan datos por completar
                </p>
              </div>
            )}
          </form>
          
        </div>
      </div>
    </section>
  );
}