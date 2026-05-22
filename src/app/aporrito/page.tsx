import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div>
      <section className="relative pt-12 pb-14 bg-[#7c00d0] clip-x overflow-hidden">
        <img src="/TransparentAssets/Asset 13.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute top-6 right-8 w-32 opacity-50 rotate-6 hidden sm:block" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50 mb-3">Νομικά</div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white">
            Πολιτική<br /><span className="text-[#c8ff00]">Απορρήτου</span>
          </h1>
          <p className="mt-4 text-white/60 text-sm">Τελευταία ενημέρωση: Μάιος 2026</p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-10 text-ink/80 text-sm leading-relaxed">

            <Block num="01" title="Γενικά">
              Η Protypa (protupa.gr) σέβεται το απόρρητό σας και δεσμεύεται να προστατεύει τα προσωπικά σας δεδομένα σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR — Κανονισμός ΕΕ 2016/679).
            </Block>

            <Block num="02" title="Δεδομένα που συλλέγουμε">
              Συλλέγουμε αποκλειστικά τα στοιχεία που απαιτούνται για τη λειτουργία της υπηρεσίας: διεύθυνση email, ονοματεπώνυμο και όνομα φροντιστηρίου κατά την εγγραφή. Δεν αποθηκεύουμε ποτέ στοιχεία πιστωτικής ή χρεωστικής κάρτας — η διεκπεραίωση πληρωμών γίνεται αποκλειστικά μέσω Stripe.
            </Block>

            <Block num="03" title="Χρήση δεδομένων">
              Τα δεδομένα σας χρησιμοποιούνται αποκλειστικά για την παροχή της υπηρεσίας, τη διαχείριση του λογαριασμού σας και την επικοινωνία σχετικά με αυτόν. Δεν μεταβιβάζουμε, δεν πωλούμε και δεν ενοικιάζουμε δεδομένα σε τρίτους.
            </Block>

            <Block num="04" title="Cookies">
              Χρησιμοποιούμε αποκλειστικά τα τεχνικώς απαραίτητα cookies για τη διατήρηση της συνόδου σύνδεσής σας. Δεν χρησιμοποιούμε cookies παρακολούθησης, ανάλυσης συμπεριφοράς ή διαφήμισης.
            </Block>

            <Block num="05" title="Δικαιώματά σας">
              Έχετε δικαίωμα πρόσβασης, διόρθωσης, διαγραφής και φορητότητας των δεδομένων σας. Για οποιοδήποτε αίτημα σχετικά με τα δεδομένα σας, επικοινωνήστε μαζί μας.
            </Block>

            <Block num="06" title="Επικοινωνία">
              Για ερωτήματα σχετικά με την πολιτική απορρήτου ή τα δεδομένα σας, αποστείλτε email στο{" "}
              <a href="mailto:info@protupa.gr" className="text-[#056ef5] font-bold hover:text-[#7c00d0] transition-colors">
                info@protupa.gr
              </a>
              {" "}ή χρησιμοποιήστε τη{" "}
              <Link href="/epikoinonia" className="text-[#056ef5] font-bold hover:text-[#7c00d0] transition-colors">
                φόρμα επικοινωνίας
              </Link>.
            </Block>
          </div>
        </div>
      </section>
    </div>
  );
}

function Block({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-6 items-start border-t border-ink/10 pt-8 first:border-t-0 first:pt-0">
      <span className="font-display text-3xl text-[#056ef5]/20 flex-shrink-0 tabular-nums">{num}</span>
      <div>
        <h2 className="font-display text-xl text-ink mb-3">{title}</h2>
        <p>{children}</p>
      </div>
    </div>
  );
}
