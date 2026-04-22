"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-violet-600" />
            <span className="text-xl font-bold text-gray-900">CreatorStack</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-sm text-gray-600 hover:text-gray-900">Funcionalidades</a>
            <a href="#preços" className="text-sm text-gray-600 hover:text-gray-900">Preços</a>
            <a href="#depoimentos" className="text-sm text-gray-600 hover:text-gray-900">Depoimentos</a>
            <Link href="/auth/" className="text-sm text-gray-600 hover:text-gray-900">Entrar</Link>
            <Link href="/auth/" className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700">Começar Grátis</Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-3">
            <a href="#funcionalidades" className="block text-sm text-gray-600 py-2">Funcionalidades</a>
            <a href="#preços" className="block text-sm text-gray-600 py-2">Preços</a>
            <a href="#depoimentos" className="block text-sm text-gray-600 py-2">Depoimentos</a>
            <Link href="/auth/" className="block text-sm text-gray-600 py-2">Entrar</Link>
            <Link href="/auth/" className="block bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center">Começar Grátis</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
