export default function Privacy() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: May 1, 2026</p>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Overview</h2>
                <p className="text-gray-600 leading-relaxed">
                    ROAM ("we", "our", or "us") is a park discovery app that helps you find and explore
                    national parks, campgrounds, and outdoor spaces. This policy explains what data we
                    collect, why we collect it, and how it is used. We do not sell your data.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Information We Collect</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
                    <li>
                        <strong>Account information:</strong> When you create an account, we collect your
                        email address and a hashed password. We do not store plain-text passwords.
                    </li>
                    <li>
                        <strong>Location data:</strong> With your permission, we access your device's
                        location to center the park map on your current position. Location is not
                        stored on our servers.
                    </li>
                    <li>
                        <strong>User-generated content:</strong> Reviews, ratings, and saved parks you
                        create are stored and associated with your account.
                    </li>
                    <li>
                        <strong>Usage data:</strong> We collect basic server logs (IP address, request
                        timestamps) for security and debugging purposes. Logs are retained for 30 days.
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 leading-relaxed">
                    <li>To authenticate you and maintain your session</li>
                    <li>To save and display your reviews and saved parks</li>
                    <li>To center the map on your location when you grant permission</li>
                    <li>To monitor for abuse and maintain service security</li>
                </ul>
                <p className="mt-3 text-gray-600 leading-relaxed">
                    We do not use your data for advertising, profiling, or any purpose beyond operating
                    the ROAM service.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Data Sharing</h2>
                <p className="text-gray-600 leading-relaxed">
                    We do not sell, trade, or rent your personal information to third parties. Your
                    data is stored on our servers (hosted on Render and MongoDB Atlas) and is not
                    shared with any external services except as required by law.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Data Retention</h2>
                <p className="text-gray-600 leading-relaxed">
                    Your account data is retained as long as your account exists. You may request
                    deletion of your account and associated data at any time by contacting us. Location
                    data is never stored on our servers.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Children's Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                    ROAM is not directed at children under 13. We do not knowingly collect personal
                    information from children under 13. If you believe a child has provided us with
                    personal data, please contact us and we will delete it.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Security</h2>
                <p className="text-gray-600 leading-relaxed">
                    We use industry-standard measures including HTTPS, hashed passwords, and JWT-based
                    authentication to protect your data. No method of transmission over the internet
                    is 100% secure; we cannot guarantee absolute security.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Your Rights</h2>
                <p className="text-gray-600 leading-relaxed">
                    You may request access to, correction of, or deletion of your personal data at
                    any time. To make a request, contact us at the email address below.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                    We may update this policy from time to time. When we do, we will update the
                    "Last updated" date at the top. Continued use of ROAM after changes constitutes
                    acceptance of the revised policy.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Contact</h2>
                <p className="text-gray-600 leading-relaxed">
                    Questions about this privacy policy? Contact us at:{" "}
                    <a
                        href="mailto:jacobbaqleh@gmail.com"
                        className="text-blue-600 hover:underline"
                    >
                        jacobbaqleh@gmail.com
                    </a>
                </p>
            </section>
        </div>
    );
}
