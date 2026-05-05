import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-8">
      <Text className="text-lg font-semibold text-gray-800 mb-2">{title}</Text>
      {children}
    </View>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <Text className="text-gray-600 leading-6">{children}</Text>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row items-start gap-2 mb-2">
      <Text className="text-gray-400 mt-1">-</Text>
      <Text className="text-gray-600 leading-6 flex-1">{children}</Text>
    </View>
  );
}

export default function PrivacyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 48 }}>
        <Text className="text-3xl font-extrabold text-gray-900 mb-1">Privacy Policy</Text>
        <Text className="text-sm text-gray-400 mb-8">Last updated: May 1, 2026</Text>

        <Section title="Overview">
          <Body>
            ROAM is a park discovery app that helps you find and explore national parks, campgrounds, and outdoor spaces. This policy explains what data we collect, why we collect it, and how it is used. We do not sell your data.
          </Body>
        </Section>

        <Section title="Information We Collect">
          <Bullet><Text className="font-semibold text-gray-700">Account information:</Text> When you create an account, we collect your email address and a hashed password. We do not store plain-text passwords.</Bullet>
          <Bullet><Text className="font-semibold text-gray-700">Location data:</Text> With your permission, we access your device's location to center the park map on your current position. Location is not stored on our servers.</Bullet>
          <Bullet><Text className="font-semibold text-gray-700">User-generated content:</Text> Reviews, ratings, and saved parks you create are stored and associated with your account.</Bullet>
          <Bullet><Text className="font-semibold text-gray-700">Usage data:</Text> We collect basic server logs (IP address, request timestamps) for security and debugging purposes. Logs are retained for 30 days.</Bullet>
        </Section>

        <Section title="How We Use Your Information">
          <Bullet>To authenticate you and maintain your session</Bullet>
          <Bullet>To save and display your reviews and saved parks</Bullet>
          <Bullet>To center the map on your location when you grant permission</Bullet>
          <Bullet>To monitor for abuse and maintain service security</Bullet>
          <Body>
            {'\n'}We do not use your data for advertising, profiling, or any purpose beyond operating the ROAM service.
          </Body>
        </Section>

        <Section title="Data Sharing">
          <Body>
            We do not sell, trade, or rent your personal information to third parties. Your data is stored on our servers (hosted on Render and MongoDB Atlas) and is not shared with any external services except as required by law.
          </Body>
        </Section>

        <Section title="Data Retention">
          <Body>
            Your account data is retained as long as your account exists. You may request deletion of your account and associated data at any time by contacting us. Location data is never stored on our servers.
          </Body>
        </Section>

        <Section title="Children's Privacy">
          <Body>
            ROAM is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us and we will delete it.
          </Body>
        </Section>

        <Section title="Security">
          <Body>
            We use industry-standard measures including HTTPS, hashed passwords, and JWT-based authentication to protect your data. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.
          </Body>
        </Section>

        <Section title="Your Rights">
          <Body>
            You may request access to, correction of, or deletion of your personal data at any time. To make a request, contact us at the email address below.
          </Body>
        </Section>

        <Section title="Changes to This Policy">
          <Body>
            We may update this policy from time to time. When we do, we will update the "Last updated" date at the top. Continued use of ROAM after changes constitutes acceptance of the revised policy.
          </Body>
        </Section>

        <Section title="Contact">
          <Body>Questions about this privacy policy? Contact us at: </Body>
          <Pressable onPress={() => Linking.openURL('mailto:jacobbaqleh@gmail.com')}>
            <Text className="text-blue-600 mt-1">jacobbaqleh@gmail.com</Text>
          </Pressable>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
