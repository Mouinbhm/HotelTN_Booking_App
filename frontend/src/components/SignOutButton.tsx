import { useMutation, useQueryClient } from "@tanstack/react-query"; // ✅ Ajout de useQueryClient
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
  const queryClient = useQueryClient(); // ✅ Utilisation correcte
  const { showToast } = useAppContext();

  const mutation = useMutation({
    mutationFn: apiClient.signOut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] }); // ✅ Correction ici
      showToast({ message: "Signed out successfully", type: "success" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
