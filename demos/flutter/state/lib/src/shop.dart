import 'package:flutter_riverpod/flutter_riverpod.dart';

class Product {
  const Product(this.id, this.name, this.price);

  final String id;
  final String name;

  /// In euros.
  final double price;
}

const products = [
  Product('mug', 'Enamel mug', 12),
  Product('notebook', 'Dot-grid notebook', 9.5),
  Product('stickers', 'Sticker pack', 4),
  Product('tote', 'Canvas tote', 18),
];

enum Currency {
  eur('€', 1),
  usd(r'$', 1.08),
  inr('₹', 90);

  const Currency(this.symbol, this.rate);

  final String symbol;
  final double rate;
}

// Sources: changed by the user.

class CartNotifier extends Notifier<Map<String, int>> {
  @override
  Map<String, int> build() => const {};

  void add(String id) => state = {...state, id: (state[id] ?? 0) + 1};

  void remove(String id) {
    final count = (state[id] ?? 0) - 1;
    state = {...state, id: count}..removeWhere((_, n) => n <= 0);
  }
}

final cartProvider = NotifierProvider<CartNotifier, Map<String, int>>(
  CartNotifier.new,
  name: 'cart',
);

class DiscountNotifier extends Notifier<bool> {
  @override
  bool build() => false;

  void toggle() => state = !state;
}

final discountProvider = NotifierProvider<DiscountNotifier, bool>(
  DiscountNotifier.new,
  name: 'discount',
);

class CurrencyNotifier extends Notifier<Currency> {
  @override
  Currency build() => Currency.eur;

  void set(Currency value) => state = value;
}

final currencyProvider = NotifierProvider<CurrencyNotifier, Currency>(
  CurrencyNotifier.new,
  name: 'currency',
);

// Derived: recomputed only when something they watch changes.

final itemCountProvider = Provider<int>(
  (ref) => ref.watch(cartProvider).values.fold(0, (a, b) => a + b),
  name: 'itemCount',
);

final subtotalProvider = Provider<double>((ref) {
  final cart = ref.watch(cartProvider);
  return products.fold(0, (sum, p) => sum + p.price * (cart[p.id] ?? 0));
}, name: 'subtotal');

final totalProvider = Provider<double>((ref) {
  final subtotal = ref.watch(subtotalProvider);
  return ref.watch(discountProvider) ? subtotal * 0.9 : subtotal;
}, name: 'total');

final totalLabelProvider = Provider<String>((ref) {
  final currency = ref.watch(currencyProvider);
  return formatMoney(ref.watch(totalProvider), currency);
}, name: 'totalLabel');

String formatMoney(double euros, Currency currency) =>
    '${currency.symbol}${(euros * currency.rate).toStringAsFixed(2)}';

/// What each derived provider watches, for drawing the graph.
const providerGraph = <String, List<String>>{
  'cart': [],
  'discount': [],
  'currency': [],
  'itemCount': ['cart'],
  'subtotal': ['cart'],
  'total': ['subtotal', 'discount'],
  'totalLabel': ['total', 'currency'],
};
