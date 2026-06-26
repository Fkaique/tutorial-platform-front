import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, ShieldAlert, Camera, CheckCircle2, AlertCircle } from 'lucide-react';

interface UserSession {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export default function AccountSettingsPage() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const savedUser = localStorage.getItem('@tutorials:user');
        if (savedUser) {
            const user: UserSession = JSON.parse(savedUser);
            setName(user.name);
            setEmail(user.email);
            if (user.avatarUrl) setAvatarPreview(user.avatarUrl);
        } else {
            navigate('/login'); 
        }
    }, [navigate]);

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file)); 
        }
    };

    const handleSaveChanges = async (e: FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            const savedUser = localStorage.getItem('@tutorials:user');
            if (!savedUser) throw new Error('Sessão expirada.');
            const currentUser: UserSession = JSON.parse(savedUser);

            let updatedAvatarUrl = currentUser.avatarUrl;

            if (avatarFile) {
                const avatarFormData = new FormData();
                avatarFormData.append('avatar', avatarFile);

                const avatarResponse = await api.patch('/users/avatar', avatarFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                updatedAvatarUrl = avatarResponse.data.avatarUrl;
            }

            const response = await api.patch(`/users/${currentUser.id}`, {
                name,
                email
            });

            const newUserSession = {
                ...currentUser,
                name: response.data.user?.name || name,
                email: response.data.user?.email || email,
                avatarUrl: updatedAvatarUrl
            };

            localStorage.setItem('@tutorials:user', JSON.stringify(newUserSession));
            setSuccessMessage('Perfil atualizado com sucesso!');

            setTimeout(() => window.location.reload(), 1000);

        } catch (err: any) {
            console.error("Erro completo na requisição:", err);
            const backendMessage = err.response?.data?.message || err.response?.data?.error;
            setErrorMessage(backendMessage || 'Erro ao salvar alterações. Verifique os dados.');
        } finally {
            setIsSubmitting(false);
        }
    };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'ATENÇÃO: Tem certeza que deseja deletar sua conta? Todos os seus dados e vídeos enviados serão apagados permanentemente.'
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    setErrorMessage('');

    try {
      const savedUser = localStorage.getItem('@tutorials:user');
      if (!savedUser) throw new Error('Sessão inválida ou expirada.');
      
      const currentUser: UserSession = JSON.parse(savedUser);

      await api.delete(`/users/${currentUser.id}`);

      localStorage.clear();
      navigate('/');
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      setErrorMessage(backendMessage || 'Erro ao tentar deletar a conta.');
    } finally {
      setIsDeleting(false);
    }
  };

    return (
        <div className="min-h-screen bg-[var(--color-black)] flex flex-col justify-between">
            <Navbar />

            <main className="max-w-2xl mx-auto w-full px-4 pt-28 pb-16 flex-grow">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 md:p-10 shadow-xl">

                    <h1 className="font-heading text-2xl font-bold col-white mb-2">Configurações da Conta</h1>
                    <p className="font-sans-serif text-sm col-white/60 mb-8">Gerencie suas informações pessoais e preferências de perfil.</p>

                    {successMessage && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-sm font-sans-serif">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm font-sans-serif">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSaveChanges} className="flex flex-col gap-6">

                        <div className="flex flex-col items-center gap-4 bg-white/0 border border-white/5 rounded-2xl p-4">
                            <div className="relative group w-24 h-24 rounded-full bg-white/10 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 col-white/40" />
                                )}

                                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="w-5 h-5 col-secondary" />
                                    <span className="text-[10px] col-white font-bold uppercase tracking-wider">Alterar</span>
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                </label>
                            </div>
                            <span className="font-sans-serif text-xs col-white/40">Formatos aceitos: JPG ou PNG</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-heading text-sm font-semibold col-white/80">Seu Nome Completo</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-4 w-4 h-4 col-white/30" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 col-white font-sans-serif text-sm focus:border-[var(--color-secondary)]/40 focus:outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-heading text-sm font-semibold col-white/80">E-mail de Acesso</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 w-4 h-4 col-white/30" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 col-white font-sans-serif text-sm focus:border-[var(--color-secondary)]/40 focus:outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[var(--color-secondary)] col-primary font-sans-serif font-bold py-3.5 rounded-xl hover:brightness-110 disabled:opacity-50 transition flex items-center justify-center gap-2 text-sm shadow-lg cursor-pointer"
                        >
                            {isSubmitting ? 'Salvando alterações...' : 'Salvar Alterações'}
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-red-500/10 flex flex-col gap-4">
                        <h3 className="font-heading text-base font-bold text-red-400 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" />
                            Zona de Perigo
                        </h3>
                        <p className="font-sans-serif text-xs col-white/60 leading-relaxed">
                            Ao deletar a sua conta, seu perfil será apagado de nossa base de dados. Esta ação não poderá ser desfeita e todas as suas aulas postadas perderão o vínculo com você.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="w-fit px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-sans-serif text-xs font-bold rounded-xl hover:bg-red-500/20 transition disabled:opacity-50 cursor-pointer"
                        >
                            {isDeleting ? 'Deletando conta...' : 'Excluir minha conta permanentemente'}
                        </button>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}