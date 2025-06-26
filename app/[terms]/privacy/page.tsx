"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, Cookie, UserCheck, FileText, AlertTriangle } from "lucide-react"

export default function PrivacyAndTermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Privacy Policy & Terms of Service
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your privacy and trust are important to us. Please review our policies and terms below.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: December 26, 2024
          </p>
        </div>

        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Privacy Policy</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Information We Collect</li>
                  <li>• How We Use Your Data</li>
                  <li>• Data Sharing & Disclosure</li>
                  <li>• Data Security</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Terms of Service</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• User Responsibilities</li>
                  <li>• Content Guidelines</li>
                  <li>• Account Terms</li>
                  <li>• Limitation of Liability</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Shield className="h-6 w-6 mr-2 text-blue-500" />
              Privacy Policy
            </CardTitle>
            <CardDescription>
              How we collect, use, and protect your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Information We Collect */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-green-500" />
                Information We Collect
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Account Information</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Email address and password</li>
                    <li>Profile information (name, profile picture)</li>
                    <li>Cooking preferences and dietary restrictions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Recipe Data</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Recipes you create, upload, or save</li>
                    <li>Recipe images and descriptions</li>
                    <li>Ingredient lists and cooking instructions</li>
                    <li>Recipe ratings and reviews</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Information</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>How you interact with our platform</li>
                    <li>Features you use and time spent</li>
                    <li>Search queries and browsing history</li>
                    <li>Device information and IP address</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* How We Use Your Data */}
            <div>
              <h3 className="text-lg font-semibold mb-3">How We Use Your Data</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                <li>Provide and improve our recipe platform services</li>
                <li>Generate personalized recipe recommendations</li>
                <li>Enable community features and social interactions</li>
                <li>Send important updates and notifications</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <Separator />

            {/* Data Sharing */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Data Sharing & Disclosure</h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                        We do not sell your personal data
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Your privacy is our priority. We never sell personal information to third parties.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">We may share data in these situations:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>With your explicit consent</li>
                    <li>To comply with legal requirements or court orders</li>
                    <li>To protect our rights, safety, or property</li>
                    <li>With service providers who help operate our platform</li>
                    <li>In case of business merger or acquisition</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* Data Security */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Data Security</h3>
              <p className="text-sm text-muted-foreground mb-3">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure cloud infrastructure (Firebase/Google Cloud)</li>
                <li>Regular backups and disaster recovery plans</li>
              </ul>
            </div>

            <Separator />

            {/* Cookies */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Cookie className="h-5 w-5 mr-2 text-orange-500" />
                Cookies & Tracking
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Essential cookies for platform functionality</li>
                <li>Analytics cookies to understand usage patterns</li>
                <li>Preference cookies to remember your settings</li>
                <li>You can control cookies through your browser settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Terms of Service Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <UserCheck className="h-6 w-6 mr-2 text-purple-500" />
              Terms of Service
            </CardTitle>
            <CardDescription>
              Rules and guidelines for using our platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Responsibilities */}
            <div>
              <h3 className="text-lg font-semibold mb-3">User Responsibilities</h3>
              <p className="text-sm text-muted-foreground mb-3">
                By using our platform, you agree to:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the platform only for lawful purposes</li>
                <li>Respect other users and their content</li>
                <li>Not attempt to hack, disrupt, or damage our services</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>

            <Separator />

            {/* Content Guidelines */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Content Guidelines</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">
                    ✓ Acceptable Content
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Original recipes and cooking tips</li>
                    <li>Food photography and recipe images</li>
                    <li>Helpful reviews and constructive feedback</li>
                    <li>Educational cooking content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">
                    ✗ Prohibited Content
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Copyrighted recipes without permission</li>
                    <li>Spam, advertising, or promotional content</li>
                    <li>Offensive, harmful, or inappropriate material</li>
                    <li>False or misleading information</li>
                    <li>Content that violates intellectual property rights</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Terms */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Account Terms</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>You must be 13 years or older to create an account</li>
                <li>One account per person; sharing accounts is prohibited</li>
                <li>We may suspend or terminate accounts that violate our terms</li>
                <li>You can delete your account at any time</li>
                <li>We reserve the right to modify or discontinue services</li>
              </ul>
            </div>

            <Separator />

            {/* Intellectual Property */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Intellectual Property</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>You retain ownership of recipes and content you create</li>
                <li>By posting content, you grant us a license to display and distribute it</li>
                <li>Our platform design, code, and features are our intellectual property</li>
                <li>Respect others' intellectual property rights</li>
              </ul>
            </div>

            <Separator />

            {/* Limitation of Liability */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Our platform is provided "as is" without warranties. We are not liable for:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                  <li>Food allergies or dietary restrictions not properly disclosed</li>
                  <li>Recipe accuracy or cooking results</li>
                  <li>User-generated content or interactions</li>
                  <li>Service interruptions or technical issues</li>
                  <li>Indirect, incidental, or consequential damages</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              Questions about our privacy policy or terms of service?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong> privacy@culinaryplatform.com
              </p>
              <p>
                <strong>Mail:</strong> Legal Department, Culinary Platform Inc., 123 Recipe Street, Food City, FC 12345
              </p>
              <p>
                <strong>Response Time:</strong> We typically respond within 2-3 business days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
