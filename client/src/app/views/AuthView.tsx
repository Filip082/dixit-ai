import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Zmienione z 'react-router' dla spójności
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Gamepad2, Mail, Lock, User } from 'lucide-react';

// Importy nowych narzędzi "silnika"
import { socket } from '../services/socket';
import { useGameStore } from '../store/useGameStore';

export function AuthView() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Stany dla pól formularza
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useGameStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Wybór odpowiedniego endpointu na podstawie trybu
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    // Przygotowanie danych (login może akceptować email lub nick)
    const payload = isLogin 
      ? { email, password } 
      : { username, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include' // 🔥 KLUCZOWE: Pozwala serwerowi zapisać ciasteczko JWT
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Zapisujemy dane użytkownika w globalnym stanie (Zustand)
        setUser(data.user);
        
        // 2. Łączymy się z Socket.io (wyśle ono automatycznie ciasteczko JWT)
        socket.connect();
        
        // 3. Przekierowujemy do menu głównego
        navigate('/menu');
      } else {
        alert(data.error || 'Wystąpił błąd podczas autoryzacji');
      }
    } catch (error) {
      console.error("Błąd połączenia z serwerem:", error);
      alert('Nie udało się połączyć z serwerem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 flex flex-col gap-8 transform transition-all duration-300">
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-orange-500 mb-6 rotate-[-5deg] shadow-lg">
          <Gamepad2 size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Dixit AI Online
        </h1>
        <p className="text-gray-500 font-medium">
          {isLogin ? 'Witaj z powrotem! Zaloguj się by grać.' : 'Stwórz konto, aby dołączyć do zabawy.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <Input 
              className="pl-12" 
              placeholder="Nick" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
        )}
        
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <Input 
            className="pl-12" 
            type={isLogin ? "text" : "email"} 
            placeholder={isLogin ? "E-Mail / Nick" : "E-Mail"} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <Input 
            className="pl-12" 
            type="password" 
            placeholder="Hasło" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <Button type="submit" size="lg" className="mt-4 w-full" disabled={loading}>
          {loading ? 'Przetwarzanie...' : (isLogin ? 'Zaloguj się' : 'Stwórz konto')}
        </Button>
      </form>

      <div className="text-center border-t border-gray-100 pt-6">
        <p className="text-gray-600 mb-4 font-medium">
          {isLogin ? "Nie masz konta?" : "Masz już konto?"}
        </p>
        <Button 
          variant="outline" 
          size="md"
          className="w-full"
          onClick={() => setIsLogin(!isLogin)}
          disabled={loading}
        >
          {isLogin ? 'Zarejestruj nowe konto' : 'Przełącz na logowanie'}
        </Button>
      </div>
    </div>
  );
}