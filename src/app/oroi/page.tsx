import Link from "next/link";

export default function TermsPage() {
  return (
    <div>
      <section className="relative pt-12 pb-14 bg-[#056ef5] clip-x overflow-hidden">
        <img src="/TransparentAssets/Asset 19.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute top-6 right-8 w-32 opacity-50 -rotate-6 hidden sm:block" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50 mb-3">Νομικά</div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white">
            Όροι<br /><span className="text-[#c8ff00]">Χρήσης</span>
          </h1>
          <p className="mt-4 text-white/60 text-sm">Τελευταία ενημέρωση: Μάιος 2026</p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-10 text-ink/80 text-sm leading-relaxed">

            <Block num="01" title="Αποδοχή όρων">
              Η χρήση της πλατφόρμας protupa.gr συνεπάγεται ανεπιφύλακτη αποδοχή των παρόντων Όρων Χρήσης. Αν δεν συμφωνείτε με τους όρους αυτούς, παρακαλούμε να μην χρησιμοποιήσετε την υπηρεσία.
            </Block>

            <Block num="02" title="Περιγραφή υπηρεσίας">
              Η Protupa παρέχει ψηφιακά εργαλεία προετοιμασίας για εξετάσεις Πρότυπων, Ωνάσειων και Εκκλησιαστικών Σχολείων. Η πρόσβαση στο περιεχόμενο παρέχεται μετά από εφάπαξ πληρωμή για καθορισμένο χρονικό διάστημα.
            </Block>

            <Block num="03" title="Λογαριασμός χρήστη">
              Είστε υπεύθυνοι για την ασφάλεια των στοιχείων σύνδεσής σας. Ο λογαριασμός είναι προσωπικός και δεν επιτρέπεται η κοινοποίηση ή μεταβίβασή του σε τρίτους.
            </Block>

            <Block num="04" title="Πληρωμές και επιστροφές">
              Όλες οι πληρωμές είναι εφάπαξ και δεν ανανεώνονται αυτόματα. Λόγω της άμεσης πρόσβασης σε ψηφιακό περιεχόμενο, οι επιστροφές χρημάτων πραγματοποιούνται αποκλειστικά σε περίπτωση τεκμηριωμένου τεχνικού προβλήματος από την πλευρά μας.
            </Block>

            <Block num="05" title="Πνευματική ιδιοκτησία">
              Όλο το περιεχόμενο της πλατφόρμας (θέματα, απαντήσεις, λογισμικό, γραφικά) αποτελεί πνευματική ιδιοκτησία της Protupa. Απαγορεύεται αυστηρώς η αναπαραγωγή, διανομή ή εμπορική εκμετάλλευσή του χωρίς γραπτή άδεια.
            </Block>

            <Block num="06" title="Τροποποίηση όρων">
              Διατηρούμε το δικαίωμα τροποποίησης των παρόντων όρων οποτεδήποτε. Οι αλλαγές θα ανακοινώνονται στην πλατφόρμα και ισχύουν από την ημέρα ανάρτησής τους.
            </Block>

            <Block num="07" title="Επικοινωνία">
              Για οποιοδήποτε ερώτημα σχετικά με τους Όρους Χρήσης, επικοινωνήστε μαζί μας στο{" "}
              <a href="mailto:info@protupa.gr" className="text-[#056ef5] font-bold hover:text-[#7c00d0] transition-colors">
                info@protupa.gr
              </a>
              {" "}ή μέσω της{" "}
              <Link href="/epikoinonia" className="text-[#056ef5] font-bold hover:text-[#7c00d0] transition-colors">
                φόρμας επικοινωνίας
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
