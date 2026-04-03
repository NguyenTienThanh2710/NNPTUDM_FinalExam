import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[870px] flex items-center bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10 text-center md:text-left">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary uppercase bg-primary-fixed rounded-full font-label">TITANIUM ARRIVAL</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-on-surface mb-6 leading-tight font-headline">
              iPhone 15 Pro.<br />
              <span className="text-gradient">Forged in Light.</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary mb-10 max-w-lg leading-relaxed">
              The first iPhone with an aerospace‑grade titanium design, using the same alloy that spacecraft use for missions to Mars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/products" className="px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg transition-all hover:shadow-primary/20 active:scale-95 text-center">
                Buy Now
              </Link>
              <Link to="/products" className="px-10 py-5 bg-surface-container-high text-on-surface font-bold rounded-xl transition-all hover:bg-surface-variant active:scale-95 text-center">
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center md:justify-end">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-fixed-dim/30 rounded-full blur-[100px]"></div>
            <img alt="Flagship Phone" className="relative z-10 w-full max-w-md md:max-w-lg drop-shadow-2xl translate-x-12 translate-y-8 rotate-3 scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAho8gCR3xBVtWF_OBl918B3OBX18-IOy9rmiB6q_jXt8IWNRJRRZWQpTQpQB1wDBWGZcKby57Z8xmpCs9B7tLuOL5HXB7_zfQElaxSri-l8DbCzdlxWvV8XEfWZKxqnbyUyxvw04bkAc3_R5U5esw48ISQOxePgujYhHm6_G4c9GLGUaO02oAntPWN-1QVCxO05jfGP_vvCYxyf59Yuk_Vjlkip25Y51AiHQ5zHqmwnWj_JxzTWfSgOzjXZAWgS4XqIju8IaV22A" />
          </div>
        </div>
      </section>

      {/* Categories Bento */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Explore Collections</h2>
            <p className="text-secondary mt-2">Find the perfect ecosystem for your lifestyle.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link to="/products" className="group relative bg-surface-container-lowest rounded-xl p-8 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 block">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">phone_iphone</span>
              <h3 className="text-xl font-bold mb-1">iPhone</h3>
              <p className="text-sm text-secondary">The world's most powerful device.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">apple</span>
            </div>
          </Link>
          
          <Link to="/products" className="group relative bg-surface-container-lowest rounded-xl p-8 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 block">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">ad_units</span>
              <h3 className="text-xl font-bold mb-1">Samsung</h3>
              <p className="text-sm text-secondary">Innovation at your fingertips.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">globe</span>
            </div>
          </Link>

          <Link to="/products" className="group relative bg-surface-container-lowest rounded-xl p-8 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 block">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">smartphone</span>
              <h3 className="text-xl font-bold mb-1">Oppo</h3>
              <p className="text-sm text-secondary">Capture your moments.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">lens_blur</span>
            </div>
          </Link>

          <Link to="/products" className="group relative bg-surface-container-lowest rounded-xl p-8 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 block">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">headphones</span>
              <h3 className="text-xl font-bold mb-1">Accessories</h3>
              <p className="text-sm text-secondary">Complete your experience.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">settings_input_hdmi</span>
            </div>
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">New Arrivals</h2>
            <Link className="text-primary font-bold flex items-center gap-1 hover:underline" to="/products">
                View All <span className="material-symbols-outlined text-lg">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-surface-container-lowest rounded-xl p-6 group transition-all hover:shadow-2xl">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-6 bg-surface">
                <span className="absolute top-4 left-4 z-20 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest font-label">-15%</span>
                <img alt="Samsung Galaxy S24" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMUCjd4A_o8ZIsz9xaLlT_xCnOarxBdusT0Ztb-6RX2lD2oJ5qUQC7QQ_FqfGRhUlpVBXf-CNv3OXgcVseTZWGDKYQ_pdTY3cSgQsleJKvTszJpuIP8lSZxc2eZABlg-zT3YyhTJZHgccaosmD1SLwhqCBVYWf5OlLPMWVB9yjt4gvbwwZJK2qnUpM2s0i8fBRWRWN390x-9Df_IUgd9uVt2l02Z9M_sOEdib0DC-UL9bHZU3ekXvHXZ8mdyRS6Qf5H5aWyEUauA" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-[10px] font-bold text-secondary ml-1">(124)</span>
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">Samsung Galaxy S24 Ultra</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-on-surface">$1,199.00</span>
                  <span className="text-sm text-secondary line-through">$1,399.00</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 group transition-all hover:shadow-2xl">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-6 bg-surface">
                <span className="absolute top-4 left-4 z-20 bg-error text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest font-label">HOT</span>
                <img alt="iPhone 15" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGtY34KJ-3YZdzpy2wzl9vjIUZje3yXz3XQJIF5ZkJOCUYr3_Z4QGvsmS3bWCu4fCjjP8uCycDxfGK2kmG06M8DJ8b5sN1vdA_FkhOk2-DV-T7jx98G0lRR528Uh0nQOAOr8xFdlF70mPH4ABwzSJxG6v-mXKEKyHtGwBs471gw-6qIwjVAHlSxaVnWdBMsTydbm9t3amF8wIpnNHnotFjGRMoXDpuGZ8b3dU2B1LcbwgePXHw6-43d5V5F7bUdhMUZ7wY2nta1A" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-[10px] font-bold text-secondary ml-1">(89)</span>
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">iPhone 15 Blue 128GB</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-on-surface">$799.00</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 group transition-all hover:shadow-2xl">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-6 bg-surface">
                <img alt="Oppo Find X7" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEjGHrqvN8ZRYJvCZk1XYPf30EIApZ9TTbukU5VCJ2NhS-64kVo41IZFWls-iU559TMJIgMzLfxqAkFVofsPPQFKx1JCpsjhU8Hf7Zx6snX2YgD3Ndf7gkzqLQWXAl5f5xikdJd-6oo1rWwP1cZxt4ocbA4N__lxX9umS2kcq3HP2Unf-21iNjOb-IamCFDObsdReLGT_nHg9ckRHX0ujBqphuDBMLqtxC4bzxjEN-0THXHPgnMdtwGa9-_lnaR8ylzTp8s7PkaQ" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-slate-300 text-sm">star</span>
                  <span className="text-[10px] font-bold text-secondary ml-1">(45)</span>
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">Oppo Find X7 Pro</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-on-surface">$949.00</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 group transition-all hover:shadow-2xl">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-6 bg-surface">
                <span className="absolute top-4 left-4 z-20 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest font-label">-20%</span>
                <img alt="Headphones" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASTI5F1N5m5bQzqXDBpPwwb15aA-JgrecnCEyGH4_1bww3KXoURJvYSTz2AzAcvcHSmhwvPdzrtCxOtitjDLm02gHxoFcoiUvWyg4n3mR3dWS_GVoSQcfoABEPIPBCD-HUlzdnfudTyTzmIsKnGpIRhB6oyH7VOuk0Z6F_knvZo4GKaChUq3tWMQlEUzbIh-QYsVoapN4Fl7cv6ozcOu-B615FAE9tpY7AO88iQqA46fQnu-RFUc2zMEwu7Lqn2aE1LskhTORUcQ" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined text-amber-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-[10px] font-bold text-secondary ml-1">(210)</span>
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">Lumina Sonic Pro Max</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-on-surface">$299.00</span>
                  <span className="text-sm text-secondary line-through">$379.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">Best Sellers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto">
          <div className="md:col-span-8 bg-slate-900 rounded-3xl overflow-hidden relative flex flex-col justify-center p-12 text-white min-h-[400px]">
            <div className="relative z-10 max-w-sm">
              <span className="text-primary-fixed-dim text-xs font-bold tracking-widest font-label uppercase">FEATURED PICK</span>
              <h3 className="text-4xl font-black mt-4 mb-4 font-headline leading-tight">Pixel 8 Pro. <br />Mint Edition.</h3>
              <p className="text-slate-300 mb-8">Experience Google AI in a beautiful new color. Fresh from every angle.</p>
              <Link to="/products" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold transition-all hover:bg-slate-200 inline-block">Shop Mint</Link>
            </div>
            <img alt="Pixel 8 Pro" className="absolute -right-20 bottom-0 w-2/3 h-full object-contain pointer-events-none opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfGCA4HtcJRoRJl0_rbMganJbMQcpiRNV5K5DmfjpDyM2kSXNqGj4cL1fHdOL1AH48VjE5xP8WQkkrhkTLCg-wSvlpeLQpxvhoXOe58HYQeSmX3qZGO6wHiSi14wfkAAsbnVme8t9PJV8NeO6ksbYORh0PAJxwZr7-s1ldk_8R7MWTnEgbss4p7D6j6yiht8Sbe00ROEUcxu7wZfBDRfny89qy5tniYMHtJVwa9Eyh7eUobYX4nOLMY63gMwsPV_hBYMnlFvMSBQ" />
          </div>
          <div className="md:col-span-4 grid grid-rows-2 gap-8">
            <Link to="/products" className="bg-surface-container-high rounded-3xl p-8 flex flex-col justify-between group cursor-pointer overflow-hidden block">
              <div>
                <h4 className="font-bold text-xl mb-1">Watch Series 9</h4>
                <p className="text-secondary text-sm">Smarter. Brighter. Mightier.</p>
              </div>
              <img alt="Smartwatch" className="w-32 self-end group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfTfpCqdg7UHkZmuzMYBME1W52NHXpm60WLRv5Swu3bcvqjzeyCtqEg-081FpsSaRnCsx4HeCl0Csfhk-09pkD_Xl9vK3GEIdKLZvsfT3H7JYMTm3a9FnXTPsOQOFDmC5Lqri9nBrvTFVeJQ_ZLxwv8G4m26md0WPjDvwbcvvroE-oF24LFC7r8Mka7t55hcBd4H7DLs-0oHB19A8tlsFgOlTr7pQTdLj8VvYdhFx9U5iKNsLNIRcWLhYdbv1XD8Ve7HS3OlbQQA" />
            </Link>
            <Link to="/products" className="bg-primary-container rounded-3xl p-8 flex flex-col justify-between group cursor-pointer overflow-hidden text-white block">
              <div>
                <h4 className="font-bold text-xl mb-1">Lumina Pods</h4>
                <p className="text-primary-fixed-dim text-sm">Pure silence. Pure sound.</p>
              </div>
              <img alt="Earbuds" className="w-32 self-end group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8ykMfKSuQB3_H5VvdXD-KhiSg46Agn_8uE0BLp7Drg94m2BBa85f12zaES95t0Ndk8ebgfgS11g8KunbloEUDpdw-yrh1OZ9LEzFWpOjA4Osf0Nko1VC9vQNL8fP4iky7_XQsgw22y-a-F5_StX3ytFJipqaKLI1oPJQDdb1mDQcDU1_OvPiiVZrk5NNsFBNXnmvWL6MuYDHiO2TSUn0Y5ORcebyVRuAKdUlHLoWfdJFzuJc6LNNjTJmVuv7IKhkqpmMRKS0cmw" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-surface-container-highest rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 border-4 border-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-primary rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-on-surface mb-6 font-headline tracking-tight">Stay ahead of the curve.</h2>
            <p className="text-secondary mb-10 text-lg">Join our newsletter to get early access to drops, exclusive titanium-grade deals, and technical insights.</p>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input className="flex-grow px-6 py-4 bg-white border-none rounded-xl text-on-surface focus:ring-2 focus:ring-primary shadow-sm" placeholder="Enter your email" type="email" />
              <button className="px-8 py-4 bg-primary text-white font-bold rounded-xl transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/20">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-slate-400 mt-6 font-medium">By subscribing, you agree to our Privacy Policy.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
