import { Link } from "react-router-dom";
import { Truck, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-xl tracking-tighter"
            >
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <Truck className="h-4 w-4" />
              </div>
              <span>CamYou Fleet</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Optimizing logistics with real-time tracking, intelligent routing,
              and seamless fleet management.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground/90">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground/90">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground/90">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@camyoufleet.com</span>
              </li>
              <li>
                <span>
                  123 Logistics Way
                  <br />
                  San Francisco, CA 94105
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 CamYou Fleet Management. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
