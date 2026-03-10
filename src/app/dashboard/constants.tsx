import { motion } from "framer-motion";
import {
    PieChart, Utensils, Dumbbell, Scale, LayoutList, Trophy, SearchCode
} from "lucide-react";

export const DIET_CATALOG = {
    standard: {
        cutting: [
            { time: "08:00", name: "Café Alpha", items: "3 ovos mexidos + 30g de aveia", protein: 25, carbs: 20, fats: 15, calories: 315, science: "Proteína matinal reduz a grelina e estabiliza a glicemia para o dia." },
            { time: "12:00", name: "Almoço Tactical", items: "150g Frango + 100g Arroz + Brócolis", protein: 45, carbs: 28, fats: 5, calories: 337, science: "Carboidratos complexos garantem glicogênio sem pico de insulina." },
            { time: "16:00", name: "Lanche Pro", items: "1 Iogurte Grego + 15g Whey", protein: 25, carbs: 10, fats: 2, calories: 158, science: "Leucina via whey estimula a síntese proteica entre refeições." },
            { time: "20:00", name: "Jantar Reset", items: "150g Patinho + Salada Verde", protein: 40, carbs: 5, fats: 10, calories: 270, science: "Zinco e magnésio da carne vermelha auxiliam na recuperação neural." }
        ],
        bulking: [
            { time: "08:00", name: "Hyper Fuel", items: "4 ovos + 80g aveia + 2 bananas", protein: 35, carbs: 85, fats: 20, calories: 660, science: "Superavit calórico matinal sinaliza anabolismo imediato ao sistema." },
            { time: "12:00", name: "Mass Builder", items: "200g Frango + 250g Arroz + 100g Feijão", protein: 65, carbs: 100, fats: 8, calories: 732, science: "Volume de aminoácidos essencial para sustentar o treino pesado." },
            { time: "16:00", name: "Anabolic Snack", items: "50g de pasta de amendoim + 3 fatias de pão + 1 Shake Whey", protein: 35, carbs: 55, fats: 25, calories: 585, science: "Gorduras boas auxiliam na produção de testosterona endógena." },
            { time: "20:00", name: "Nite Recovery", items: "200g Patinho + 250g Batata Doce + Azeite", protein: 55, carbs: 65, fats: 15, calories: 615, science: "Carbo de baixo IG antes de dormir facilita a recuperação do SNC." }
        ]
    },
    economical: {
        cutting: [
            { time: "08:00", name: "Ovo-Protocol", items: "4 ovos cozidos", protein: 24, carbs: 2, fats: 20, calories: 284, science: "Ovo é a proteína de maior valor biológico disponível no mercado." },
            { time: "12:00", name: "Fuel Base", items: "150g Moída + 100g Arroz + Feijão", protein: 35, carbs: 45, fats: 12, calories: 428, science: "Combo arroz e feijão oferece perfil completo de aminoácidos essenciais." },
            { time: "20:00", name: "Night Base", items: "150g Frango + Brócolis", protein: 40, carbs: 5, fats: 4, calories: 216, science: "Baixo carbo noturno prioriza a oxidação lipídica durante o sono." }
        ],
        bulking: [
            { time: "08:00", name: "Mega Egg", items: "5 ovos + 150g Arroz + Azeite", protein: 32, carbs: 65, fats: 30, calories: 658, science: "Colesterol do ovo é precursor de hormônios esteroides." },
            { time: "12:00", name: "Heavy Plate", items: "200g Moída + 300g Arroz + 150g Feijão", protein: 55, carbs: 120, fats: 22, calories: 898, science: "Densidade calórica barata para bater metas de ganho de peso." },
            { time: "16:00", name: "Quick Gains", items: "Cuscuz (200g) + 3 Ovos", protein: 25, carbs: 90, fats: 18, calories: 622, science: "Cuscuz é uma fonte de carbo de excelente custo-benefício." },
            { time: "20:00", name: "Final Surge", items: "200g Frango + 250g Macarrão + Molho Sugo", protein: 55, carbs: 100, fats: 8, calories: 692, science: "Reposição de glicogênio para o treino do dia seguinte." }
        ]
    },
    practical: {
        cutting: [
            { time: "08:00", name: "Express Lean", items: "1 Shake: 30g Whey + 20g Aveia", protein: 28, carbs: 15, fats: 3, calories: 199, science: "Absorção rápida para quem não tem tempo de cozinhar." },
            { time: "12:00", name: "Marmita Reset", items: "150g Frango + 100g Arroz (Congelado)", protein: 40, carbs: 28, fats: 4, calories: 308, science: "Praticidade ajuda na manutenção do hábito sem desculpas." },
            { time: "20:00", name: "Turbo Lean", items: "Atum Lata + 2 fatias Pão Integral", protein: 20, carbs: 24, fats: 2, calories: 194, science: "Ômega 3 do atum auxilia na redução de processos inflamatórios." }
        ],
        bulking: [
            { time: "08:00", name: "Anabolic Shake", items: "60g Whey + 120g Aveia + 40g Pasta Amendoim + 1 Banana", protein: 60, carbs: 90, fats: 25, calories: 825, science: "Densidade de nutrientes líquida facilita a ingestão em grande volume." },
            { time: "12:00", name: "Marmita Bulk", items: "250g Carne + 300g Macarrão", protein: 65, carbs: 110, fats: 16, calories: 844, science: "Carboidratos de massa são absorvidos mais rápido que arroz." },
            { time: "16:00", name: "Hi-Cal Bar", items: "2 Barras de proteína + 2 Maçãs", protein: 40, carbs: 60, fats: 20, calories: 580, science: "Micronutrientes da maçã auxiliam na rdigestibilidade." },
            { time: "20:00", name: "Power Sandwich", items: "4 fatias Pão de Forma + 150g Frango + Queijo Duplo", protein: 55, carbs: 80, fats: 22, calories: 738, science: "Fácil digestão antes do sono anabólico." }
        ]
    }
};

export const SUGGESTIONS_CUTTING = DIET_CATALOG.standard.cutting;
export const SUGGESTIONS_BULKING = DIET_CATALOG.standard.bulking;

export const WORKOUTS = [
    { title: "Treino A - Dorsal e Bíceps", desc: "Puxada Frontal (4x12), Remada Curvada (4x10), Rosca Direta (3x12)" },
    { title: "Treino B - Peito e Tríceps", desc: "Supino Reto (4x10), Tríceps Corda (3x12), Paralelas (3x10)" },
    { title: "Treino C - Quadríceps", desc: "Agachamento Livre (4x8), Leg Press (4x12), Extensora (3x15)" },
    { title: "Treino D - Deltóides e Trapézio", desc: "Desenvolvimento (4x10), Elevação Lateral (4x15), Encolhimento (3x12)" },
];

export const SIDEBAR_ITEMS = [
    { id: 'overview', icon: PieChart, label: 'Visão Geral', proOnly: false },
    { id: 'dieta', icon: Utensils, label: 'Dieta & Ciência', proOnly: false },
    { id: 'treinos', icon: Dumbbell, label: 'Protocolo de Treino', proOnly: false },
    { id: 'grid', icon: LayoutList, label: 'The Grid (Rotina)', proOnly: false },
    { id: 'scanner', icon: SearchCode, label: 'Scan de Whey (IA)', proOnly: false },
    { id: 'esportiva_link', icon: Trophy, label: 'Nutrição Esportiva', isExternal: true, proOnly: true },
];

export const WaterWave = ({ progress }: { progress: number }) => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: `${100 - progress}%` }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
                className="absolute inset-0 bg-blue-500/10"
            >
                {/* Wave 1 */}
                <motion.svg
                    viewBox="0 0 120 28"
                    preserveAspectRatio="none"
                    className="absolute -top-[20px] left-0 w-[200%] h-12 text-blue-500/20 fill-current"
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                >
                    <path d="M0 15 Q30 5 60 15 T120 15 V30 H0 Z" />
                </motion.svg>
                {/* Wave 2 */}
                <motion.svg
                    viewBox="0 0 120 28"
                    preserveAspectRatio="none"
                    className="absolute -top-[15px] left-0 w-[200%] h-10 text-blue-400/30 fill-current"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                >
                    <path d="M0 15 Q30 25 60 15 T120 15 V30 H0 Z" />
                </motion.svg>

                {/* Visual Depth Fill */}
                <div className="absolute top-[5px] inset-x-0 bottom-0 bg-gradient-to-b from-blue-500/20 to-blue-600/10 backdrop-blur-[2px]" />
            </motion.div>
        </div>
    );
};
