import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator /></View>;
  }

  if (isAuthenticated) {
    return <Redirect href="/(gym)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
